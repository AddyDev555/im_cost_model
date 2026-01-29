'use client';
export const dynamic = "force-dynamic";
import React, { useEffect, useState, useRef } from 'react'
import { MDZCartonCostModel, FlexibleCostModel } from "../costingModels/models";
import SkuDescription from '../calculation_models/sku_description';
import SlateEditor from '../../components/ui/richTextBox';
import PDFDownload from '../calculation_models/pdf_download';
import { NotebookPen, FileText, TriangleAlert } from 'lucide-react';
import { api } from "@/utils/api";
import { toast } from 'react-toastify';
import MagicLinkDialog from '../../components/ui/userVerification';
import { markupToNotes, notesToMarkup } from "../../components/ui/richTextBox"; // Import both helpers
import DataTable from '@/components/ui/data-table';

/* ============================
   SHEET NAME MAP
============================ */
const sheetNameMapping = {
    carton_cost_model: "Carton Cost Model",
    flexible_cost_model: "Flexible Cost Model"
};

/* ============================
   MODEL MAPPING - Maps sheet names to their respective models
============================ */
const MODEL_CONFIG = {
    carton_cost_model: {
        model: MDZCartonCostModel,
        inputSegments: [
            {
                title: "BOARD Inputs",
                insertAt: "START",
            },
            {
                title: "CORRUGATION Inputs",
                afterLabel: "Conversion Wastage",
            },
            {
                title: "FOIL STAMPING Inputs",
                afterLabel: "Paper Wastage",
            },
        ],
        summarySegments: [
            {
                title: "COST Summary",
                insertAt: "START",
            },
            {
                title: "CORRUGATION Summary",
                afterLabel: "Labour Cost - Single Side",
            },
        ],
    },
    flexible_cost_model: {
        model: FlexibleCostModel,
        inputSegments: [
            {
                title: "Layer 1",
                afterLabel: "Laminate GSM",
            },
            {
                title: "Layer 2",
                afterLabel: "L1 Layer Rate",
            },
            {
                title: "Layer 3",
                afterLabel: "L2 Layer Rate",
            },
            {
                title: "Layer 4",
                afterLabel: "L3 Layer Rate",
            },
            {
                title: "Layer 5",
                afterLabel: "L4 Layer Rate",
            },
            {
                title: "Layer 6",
                afterLabel: "L5 Layer Rate",
            },
            {
                title: "Layer 7",
                afterLabel: "L6 Layer Rate",
            },
            {
                title: "Layer 8",
                afterLabel: "L7 Layer Rate",
            },
            {
                title: "Layer 9",
                afterLabel: "L8 Layer Rate",
            },
        ],
        summarySegments: [
            {
                title: "Layer 1",
                afterLabel: "No of Sleeve per sqm",
            },
            {
                title: "Layer 2",
                afterLabel: "L1 Layer Cost",
            },
            {
                title: "Layer 3",
                afterLabel: "L2 Layer Cost",
            },
            {
                title: "Layer 4",
                afterLabel: "L3 Layer Cost",
            },
            {
                title: "Layer 5",
                afterLabel: "L4 Layer Cost",
            },
            {
                title: "Layer 6",
                afterLabel: "L5 Layer Cost",
            },
            {
                title: "Layer 7",
                afterLabel: "L6 Layer Cost",
            },
            {
                title: "Layer 8",
                afterLabel: "L7 Layer Cost",
            },
            {
                title: "Layer 9",
                afterLabel: "L8 Layer Cost",
            },
            {
                title: "Lamination Summary",
                afterLabel: "L9 Layer Cost",
            }
        ],
    }
};

/* ============================
   CACHE HELPERS
============================ */
const CACHE_KEY = "inputsData";
const CACHE_TS_KEY = "inputsDataTimestamp";
const CACHE_SHEET_KEY = "inputsDataSheetName";

export default function Page() {
    const [allFormData, setAllFormData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [loadingSummary, setLoadingSummary] = useState(false);
    const [countryName, setCountryName] = useState("India");
    const [ppRate, setPpRate] = useState([]);
    const [loadingPpRate, setLoadingPpRate] = useState(false);
    const [updateVersionMessage, setUpdateVersionMessage] = useState("");
    const [userCred, setUserCred] = useState("");
    const [actualValues, setActualValues] = useState({});

    const [sheetName, setSheetName] = useState("carton_cost_model");


    const printDateTime = new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    /* ============================
       GET CURRENT MODEL CONFIG
    ============================ */
    const getCurrentModelConfig = () => {
        if (!sheetName) return MODEL_CONFIG.carton_cost_model;
        return MODEL_CONFIG[sheetName] ?? MODEL_CONFIG.carton_cost_model;
    };
    const modelConfig = getCurrentModelConfig();
    const currentModel = modelConfig?.model;

    if (!currentModel) {
        console.error("Model not found for sheet:", sheetName);
    }

    const INPUT_SEGMENTS = getCurrentModelConfig().inputSegments;
    const SUMMARY_SEGMENTS = getCurrentModelConfig().summarySegments;

    /* ============================
       NOTES STATE
    ============================ */
    const [isNotesVisible, setIsNotesVisible] = useState(false);
    const notesEditorRef = useRef(null);
    const notesButtonRef = useRef(null);
    const [notes, setNotes] = useState('');
    const isInitialNotesLoad = useRef(true);

    const mapMDZInputsToTableData = (modelInputs, backendInputData = []) => {
        return Object.entries(modelInputs).map(([modelKey, modelLabel]) => {
            const backendRow = backendInputData.find(
                i =>
                    i.label === modelKey ||
                    i.label === modelLabel ||
                    i.key === modelKey
            );

            const resolvedValue =
                backendRow?.value !== undefined &&
                    backendRow?.value !== null &&
                    backendRow?.value !== "" &&
                    !isNaN(Number(backendRow.value))
                    ? parseFloat(Number(backendRow.value).toFixed(2))
                    : backendRow?.value ?? "";

            return {
                key: modelKey,                    // UI identity
                label: modelLabel,                // Display label
                cell: backendRow?.cell || null,   // ✅ PRESERVED
                unit: backendRow?.unit || "",
                value: resolvedValue,             // editable
                recommendedValue: resolvedValue,  // UI snapshot
                dropdownValues: backendRow?.dropdownValues || []
            };
        });
    };

    const applySegmentation = (data = [], segments = []) => {
        let result = [...data];

        segments.forEach(segment => {
            const segmentRow = {
                isSegment: true,
                label: segment.title,
            };

            if (segment.insertAt === "START") {
                result.unshift(segmentRow);
                return;
            }

            if (segment.afterLabel) {
                const index = result.findIndex(
                    r => r.label === segment.afterLabel
                );

                if (index !== -1) {
                    result.splice(index + 1, 0, segmentRow);
                }
            }
        });

        return result;
    };

    const handleActualValueChange = (key, newValue) => {
        // 1️⃣ Store actual value for UI
        setActualValues(prev => ({
            ...prev,
            [key]: newValue
        }));

        // 2️⃣ Overwrite real value (for backend & summary)
        setAllFormData(prev => ({
            ...prev,
            inputData: prev.inputData.map(row =>
                row.key === key
                    ? { ...row, value: newValue }
                    : row
            )
        }));
    };

    /* ============================
     FETCH INPUT DATA
  ============================ */
    const initializeApp = async () => {
        setIsLoading(true);

        const cachedDataRaw = localStorage.getItem(CACHE_KEY);
        const cachedData = cachedDataRaw ? JSON.parse(cachedDataRaw) : null;
        const cachedTs = localStorage.getItem(CACHE_TS_KEY);
        const cachedSheet = localStorage.getItem(CACHE_SHEET_KEY);

        const oneDay = 24 * 60 * 60 * 1000;

        const isValidCache =
            cachedData &&
            cachedTs &&
            cachedSheet === sheetName &&
            Date.now() - Number(cachedTs) < oneDay;

        /* USE CACHE IF VALID */
        if (cachedData?.inputsData === allFormData.inputData && isValidCache) {
            setAllFormData(cachedData);
            setIsLoading(false);
            return;
        }

        /* ============================
           CLEAN OLD CACHE ON SHEET CHANGE
        ============================ */
        localStorage.removeItem(CACHE_KEY);
        localStorage.removeItem(CACHE_TS_KEY);
        localStorage.removeItem(CACHE_SHEET_KEY);

        try {
            const payload = {
                mode: "fetch",
                modelName: sheetName,
                countryName: countryName,
                costModelKey: "Mondeleze"
            };

            const result = await api.post("/api/inputs/get-inputs-data", payload);

            if (result?.success && result?.inputData) {
                console.log("SHEET NAME:", sheetName);
                console.log("MODEL_CONFIG keys:", Object.keys(MODEL_CONFIG));
                console.log("MODEL_CONFIG[sheetName]:", MODEL_CONFIG[sheetName]);
                console.log("CURRENT MODEL:", currentModel);
                console.log("MODEL INPUTS:", currentModel?.inputs);
                console.log("FORM DATA:", allFormData);



                const mappedInputData = mapMDZInputsToTableData(
                    currentModel.inputs,
                    result.inputData
                );

                const mappedSummary = mapMDZInputsToTableData(
                    currentModel.summary,
                    result.inputData
                );

                const mappedSKUDescription = mapMDZInputsToTableData(
                    currentModel.sku_description,
                    result.inputData
                );

                const finalData = {
                    ...result,
                    inputData: mappedInputData,
                    summaryData: mappedSummary,
                    skuDescription: mappedSKUDescription
                };

                localStorage.setItem(CACHE_KEY, JSON.stringify(finalData));
                localStorage.setItem(CACHE_TS_KEY, Date.now().toString());
                localStorage.setItem(CACHE_SHEET_KEY, sheetName);

                setAllFormData(finalData);
            }
            else {
                toast.error("Invalid backend response");
            }
        } catch (err) {
            toast.error("Backend data fetch failed");
        } finally {
            setIsLoading(false);
        }
    };

    /* ============================
       RUN ON SHEET CHANGE
    ============================ */
    useEffect(() => {
        initializeApp();
    }, [sheetName, countryName]);

    /* ============================
       NOTES FETCH
    ============================ */
    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const user = localStorage.getItem("user_cred");
                if (!user) return;

                const email = JSON.parse(user).email;

                const data = await api.get(
                    `/api/notes/get-notes?username=${encodeURIComponent(email)}`
                );

                if (Array.isArray(data?.notes) && data.notes.length > 0) {
                    const combinedMarkup = data.notes
                        .map(n => n.content || "")
                        .filter(Boolean)
                        .join("\n\n");

                    if (combinedMarkup) {
                        const slateContent = markupToNotes(combinedMarkup);
                        setNotes(slateContent);
                    } else {
                        setNotes([{ type: "paragraph", children: [{ text: "" }] }]);
                    }

                    isInitialNotesLoad.current = true;
                } else {
                    setNotes([{ type: "paragraph", children: [{ text: "" }] }]);
                    isInitialNotesLoad.current = true;
                }
            } catch (err) {
                toast.error("Notes backend fetch failed");
                setNotes([{ type: 'paragraph', children: [{ text: '' }] }]);
            }
        };
        fetchNotes();
    }, []);

    /* ============================
       NOTES SAVE (DEBOUNCED)
    ============================ */
    useEffect(() => {
        if (isInitialNotesLoad.current) {
            isInitialNotesLoad.current = false;
            return;
        }

        if (!notes) return;

        const timer = setTimeout(async () => {
            try {
                const user = localStorage.getItem("user_cred");
                if (!user) return;

                const email = JSON.parse(user).email;

                // Notes is already a markup string from SlateEditor's onChange
                // Just send it directly
                const result = await api.post("/api/notes/update-notes", {
                    email,
                    notes: [{ content: notes }], // notes is markup string
                });

                if (result.success) {
                    toast.success("Notes saved");
                } else {
                    toast.error("Notes failed to saved");
                }
            } catch (err) {
                toast.error("Server didn't saved the Notes");
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [notes]);

    /* ============================
       CLICK OUTSIDE NOTES
    ============================ */
    useEffect(() => {
        const handler = (e) => {
            if (
                isNotesVisible &&
                notesEditorRef.current &&
                !notesEditorRef.current.contains(e.target) &&
                notesButtonRef.current &&
                !notesButtonRef.current.contains(e.target)
            ) {
                setIsNotesVisible(false);
            }
        };

        if (isNotesVisible) {
            document.addEventListener("mousedown", handler);
        }

        return () => document.removeEventListener("mousedown", handler);
    }, [isNotesVisible]);

    /* ============================
       ACTIONS
    ============================ */
    const handleReset = () => {
        const cached = localStorage.getItem(CACHE_KEY);
        const cachedSheet = localStorage.getItem(CACHE_SHEET_KEY);

        if (cached && cachedSheet === sheetName) {
            setAllFormData(JSON.parse(cached));
            setActualValues({})
        };
    };

    const isSameInputData = (a = [], b = []) => {
        return JSON.stringify(a) === JSON.stringify(b);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!userCred) {
            toast.warning("Please Login to Calculate!");
            return;
        }

        const cachedRaw = localStorage.getItem(CACHE_KEY);
        const cachedSheet = localStorage.getItem(CACHE_SHEET_KEY);

        if (cachedRaw && cachedSheet === sheetName) {
            const cached = JSON.parse(cachedRaw);

            const cachedInputData = cached?.inputData || [];
            const currentInputData = allFormData?.inputData || [];

            if (isSameInputData(cachedInputData, currentInputData)) {
                toast.info("No changes detected. Calculation already up to date.");
                return;
            }
        }

        console.log("Submitting data for calculation:", allFormData.inputData);

        setLoadingSummary(true);

        const payload = {
            mode: "update",
            modelName: `${sheetName}_v2`,
            email: JSON.parse(userCred).email,
            inputData: allFormData.inputData || [],
            costModelKey: "Mondeleze"
        };

        api.post("/api/updates/update-inputs", payload)
            .then(res => {
                if (!res.success) toast.error(res.message || "Server Issue Calculation Failed");

                if (res.status === 401) {
                    toast.warning(res.detail || "Login required to calculate");
                    return;
                }

                const formatSummary = mapMDZInputsToTableData(
                    currentModel.summary,
                    res.summaryData || []
                );

                setAllFormData(prev => ({
                    ...prev,
                    summaryData: prev.summaryData.map(oldRow => {
                        const updatedRow = formatSummary.find(r => r.key === oldRow.key);
                        if (!updatedRow) return oldRow;

                        return {
                            ...oldRow,
                            value: updatedRow.value,
                        };
                    }),
                }));
                console.log("Calculation response:", formatSummary);
            })

            .catch(console.error)
            .finally(() => setLoadingSummary(false));
    };

    const printWithFilename = () => {
        const originalTitle = document.title;
        const now = new Date();
        document.title = `${now.toISOString().replace(/[:.]/g, '-')}_${sheetName}`;
        window.print();
        document.title = originalTitle;
    };

    const formatValue = v =>
        typeof v === "number" ? Math.round(v) : v;

    /* ---------------------------------------------
        POLYMER PRICES (IM only)
        --------------------------------------------- */
    // useEffect(() => {
    //     const fetchPPData = async () => {
    //         setLoadingPpRate(true);
    //         try {
    //             const json = await api.get("/api/material/pp-rate");
    //             setPpRate(json.data || []);
    //         } catch (e) {
    //             toast.error("Failed to fetch PP rate");
    //         } finally {
    //             setLoadingPpRate(false);
    //         }
    //     };

    //     fetchPPData();
    // }, [sheetName]);

    useEffect(() => {
        const cred = localStorage.getItem("user_cred");

        if (!cred) {
            return;
        }
        else {
            setUserCred(cred);
        }
        async function versionCheck() {
            const payload = {
                email: JSON.parse(cred).email,
            };
            try {
                const response = await api.post(
                    "/api/version/version-check",
                    payload
                );

                console.log("Version check response:", response);
                setUpdateVersionMessage(response.message || "");
            } catch (error) {
                console.error("Version check failed:", error.message);
                throw error;
            }
        }

        versionCheck(JSON.parse(localStorage.getItem("user_cred"))?.email);
    }, []);

    /* ============================
       RENDER
    ============================ */
    return (
        <div>
            {updateVersionMessage && (
                <div className="w-full bg-red-200 text-black text-sm flex items-center justify-center gap-1 print:hidden">
                    <p className="py-2 px-4 font-semibold">{updateVersionMessage}</p>
                </div>
            )}
            <div className="px-4 print:hidden">
                <div className="flex flex-col md:flex-row items-start md:items-center px-4 py-2 bg-white shadow rounded gap-2 md:gap-0">
                    <div className="w-25 md:mb-0">
                        <img src="mondelez-logo.png" alt="Mondelez Logo" />
                    </div>
                    <div className="flex ml-5 flex-wrap gap-x-4 gap-y-4">
                        {isLoading ? (
                            <div className="flex flex-wrap gap-4">
                                {[0, 1, 2, 3].map(i => (
                                    <div key={i} className="flex flex-col">
                                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1" />
                                        <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            (allFormData?.skuDescription || []).map((item, index) => {
                                const key = item.key || item.label || index;
                                const label = item.label ?? key;
                                const value = item.value ?? "";
                                const isCurrency =
                                    label.toLowerCase().includes("currency") ||
                                    label.toLowerCase().includes("symbol");

                                const hasDropdown =
                                    Array.isArray(item.dropdownValues) &&
                                    item.dropdownValues.length > 0;

                                return (
                                    <div key={key} className="flex flex-col w-40">
                                        <label className="text-xs font-medium text-gray-600 mb-1">
                                            {label}
                                        </label>

                                        {hasDropdown ? (
                                            <select
                                                value={value}
                                                onChange={(e) => {
                                                    const newValue = e.target.value;
                                                    setAllFormData(prev => ({
                                                        ...prev,
                                                        skuDescriptions: prev.skuDescriptions.map((row, i) =>
                                                            i === index ? { ...row, value: newValue } : row
                                                        )
                                                    }));

                                                    if (label.toLowerCase() === "country") {
                                                        setCountryName(newValue);
                                                    }
                                                }}
                                                className="p-1 px-2 border rounded text-sm bg-white"
                                            >
                                                <option value="">Select</option>
                                                {item.dropdownValues.map(opt => (
                                                    <option key={opt} value={opt}>
                                                        {opt}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                type="text"
                                                value={value}
                                                readOnly={isCurrency}
                                                onChange={(e) => {
                                                    const newValue = e.target.value;
                                                    setAllFormData(prev => ({
                                                        ...prev,
                                                        skuDescriptions: prev.skuDescriptions.map((row, i) =>
                                                            i === index ? { ...row, value: newValue } : row
                                                        )
                                                    }));

                                                    if (label.toLowerCase() === "country") {
                                                        setCountryName(newValue);
                                                    }
                                                }}
                                                className={`p-1 px-2 border rounded text-sm ${isCurrency ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                                                    }`}
                                            />
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                    <div className="ml-auto">
                        <div className="flex items-center gap-3">
                            <select
                                value={sheetName}
                                onChange={(e) => setSheetName(e.target.value)}
                                className="text-sm border px-1 py-1 rounded mb-1"
                            >
                                {Object.entries(sheetNameMapping).map(([k, v]) => (
                                    <option key={k} value={k}>{v}</option>
                                ))}
                            </select>

                            <MagicLinkDialog />
                        </div>
                        <div className='flex gap-1'>
                            <button onClick={handleReset} className="text-sm bg-gray-500 hover:bg-gray-600 cursor-pointer text-white px-5.5 py-1 rounded">
                                Reset
                            </button>

                            <button onClick={handleSubmit} className="text-sm bg-white hover:bg-slate-50 cursor-pointer border border-violet-500 px-5.5 py-1 rounded">
                                Calculate
                            </button>

                        </div>
                    </div>
                </div>
            </div>

            {/* PRINT HEADER */}
            <div className="hidden print:block px-4 pt-4 pb-2">
                <h1 className="text-xl font-bold text-center uppercase">
                    {sheetNameMapping[sheetName]}
                </h1>

                <p className="text-xs text-center text-gray-600 mt-1">
                    Printed on: {printDateTime}
                </p>

                <hr className="my-3 border-gray-400" />
            </div>


            <div className="p-2 px-4 grid grid-cols-1 lg:grid-cols-2 gap-2">
                <div className="print:order-2 order-1">

                    {/* <h3 className="font-bold pb-3 text-sm">Inputs</h3> */}

                    {isLoading ? (
                        <div className="space-y-2">
                            {[0, 1, 2, 3].map(i => (
                                <div key={i} className="h-8 bg-gray-200 rounded animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <DataTable
                            columns={[
                                {
                                    title: "Label",
                                    key: "label",
                                    render: (row) => {
                                        if (row.isSegment) {
                                            return (
                                                <div className="font-bold text-sm uppercase text-violet-700 py-2">
                                                    {row.label}
                                                </div>
                                            );
                                        }
                                        return row.label;
                                    }
                                },
                                { title: "Unit", key: "unit" },
                                {
                                    title: "Recommended Value",
                                    key: "recommendedValue",
                                    render: (row) =>
                                        row.isSegment ? null : (
                                            <input
                                                readOnly
                                                value={row.recommendedValue ?? ""}
                                                className="w-full bg-gray-100 border px-2 py-1 text-sm"
                                            />
                                        )
                                },
                                {
                                    title: "Actual Value",
                                    key: "actual",
                                    render: (row) => {
                                        if (row.isSegment) return null;

                                        const hasDropdown =
                                            Array.isArray(row.dropdownValues) &&
                                            row.dropdownValues.length > 0;

                                        const actual = actualValues[row.key] ?? "";

                                        return hasDropdown ? (
                                            <select
                                                className="w-full border px-2 py-1 text-sm"
                                                value={actual}
                                                onChange={(e) =>
                                                    handleActualValueChange(row.key, e.target.value)
                                                }
                                            >
                                                <option value="">Select</option>
                                                {row.dropdownValues.map(opt => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                className="w-full border px-2 py-1 text-sm"
                                                value={actual}
                                                onChange={(e) =>
                                                    handleActualValueChange(row.key, e.target.value)
                                                }
                                            />
                                        );
                                    }
                                }
                            ]}
                            data={applySegmentation(
                                allFormData.inputData || [],
                                INPUT_SEGMENTS
                            )}

                            mode="Mondeleze"
                        />
                    )}
                </div>


                <div className="print:order-1 order-2">
                    {/* <h3 className="font-bold pb-3 text-sm">Summary</h3> */}

                    {isLoading || loadingSummary ? (
                        <div className="space-y-2">
                            {[0, 1, 2, 3].map(i => (
                                <div key={i} className="h-8 bg-gray-200 rounded animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <DataTable
                            columns={[
                                {
                                    title: "Label",
                                    key: "label",
                                    render: (row) =>
                                        row.isSegment ? (
                                            <div className="py-2 font-bold text-sm uppercase text-violet-700">
                                                {row.label}
                                            </div>
                                        ) : (
                                            row.label
                                        ),
                                },
                                {
                                    title: "Unit",
                                    key: "unit",
                                    render: (row) => (row.isSegment ? null : row.unit),
                                },
                                {
                                    title: "Recommended Value",
                                    key: "recommendedValue",
                                    render: (row) =>
                                        row.isSegment ? null : (
                                            <span className="text-gray-500">
                                                {row.recommendedValue}
                                            </span>
                                        ),
                                },
                                {
                                    title: "Actual Value",
                                    key: "value",
                                    render: (row) =>
                                        row.isSegment ? null : (
                                            <span className="font-semibold">
                                                {row.value}
                                            </span>
                                        ),
                                },
                            ]}
                            data={applySegmentation(
                                allFormData.summaryData || [],
                                SUMMARY_SEGMENTS
                            )}
                            mode="Mondeleze"
                        />
                    )}
                </div>


            </div>

            {isNotesVisible && (
                <div ref={notesEditorRef} className="fixed bottom-15 right-8 z-50">
                    <SlateEditor notes={notes} setNotes={setNotes} />
                </div>
            )}

            <div className="fixed bottom-4 right-8 z-50 flex items-center gap-2 print:hidden">
                {/* <div>
          <SaveExcelButton sheetName={sheetName} mode="update" />
        </div> */}
                <button onClick={printWithFilename} className="cursor-pointer px-3 py-1.5 bg-white border border-red-400 font-semibold rounded flex items-center justify-center shadow-lg hover:bg-red-400 hover:text-white transition-colors" aria-label="Download PDF" > {/* <Download className="w-5 h-5" /> */}
                    <div className="flex align-center">
                        <p className="text-sm pr-2">Save pdf</p>
                        <FileText className="w-5 h-5" /> </div>
                </button>
                <button ref={notesButtonRef} onClick={() => setIsNotesVisible(!isNotesVisible)} className="cursor-pointer w-9 h-9 bg-violet-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-violet-600 transition-colors" aria-label="Toggle notes editor" >
                    <NotebookPen className="w-4.5 h-4.5" />
                </button>
            </div>
        </div>
    );
}