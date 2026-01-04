'use client';
import React, { useEffect, useMemo, useState } from 'react';
import DataTable from '../../components/ui/data-table';
import ApiDataTable from '../../components/ui/api-table';
import { api } from "@/utils/api";
import { IMCostModelMapper, CartonCostModel, CorrugateCostModel, RigidEBMCostModel, RigidISBM1CostModel, RigidISBM2CostModel, TubeCostModelMapper } from "../costingModels/models";


const SHOW_POLYMER_SHEETS = new Set([
    "im_cost_model",
    "rigid_ebm_cost_model",
    "rigid_isbm1_cost_model",
    "rigid_isbm2_cost_model",
]);
/* ---------------------------------------------
   SHEET → MAPPINGS
--------------------------------------------- */
function resolveMappings(sheetName) {
    switch (sheetName) {
        case "im_cost_model":
            return {
                inputMap: IMCostModelMapper.material_inputs,
                summaryMap: IMCostModelMapper.material_summary
            };

        case "carton_cost_model":
            return {
                inputMap: CartonCostModel.material_inputs,
                summaryMap: CartonCostModel.material_summary
            };

        case "corrugate_cost_model":
            return {
                inputMap: CorrugateCostModel.material_inputs,
                summaryMap: CorrugateCostModel.material_summary,
            };

        case "rigid_ebm_cost_model":
            return {
                inputMap: RigidEBMCostModel.material_inputs,
                summaryMap: RigidEBMCostModel.material_summary,
            };

        case "rigid_isbm1_cost_model":
            return {
                inputMap: RigidISBM1CostModel.material_inputs,
                summaryMap: RigidISBM1CostModel.material_summary,
            };

        case "rigid_isbm2_cost_model":
            return {
                inputMap: RigidISBM2CostModel.material_inputs,
                summaryMap: RigidISBM2CostModel.material_summary,
            };
        case "tube_cost_model":
            return {
                inputMap: TubeCostModelMapper.material_inputs,
                summaryMap: TubeCostModelMapper.material_summary,
            };

        default:
            return { inputMap: {}, summaryMap: {} };
    }
}

export default function MaterialCalculator({
    loadingPpRate,
    ppRate = [],
    isLoading,
    sheetName,          // im_cost_model | carton_cost_model
    allFormData,
    setAllFormData,
    loadingSummary
}) {
    const [originalInputData, setOriginalInputData] = useState([]);
    const [staticData, setStaticData] = useState([]);
    const inputData = allFormData?.inputData || [];
    const showPolymerPrices = SHOW_POLYMER_SHEETS.has(sheetName);


    /* ---------------------------------------------
       DYNAMIC MAPPING
    --------------------------------------------- */
    const { inputMap, summaryMap } = useMemo(
        () => resolveMappings(sheetName),
        [sheetName]
    );

    useEffect(() => {
        if (!inputData.length) return;

        let snapshot;

        const stored = localStorage.getItem("inputsData");
        if (!stored) {
            snapshot = inputData;
            localStorage.setItem(
                "inputsData",
                JSON.stringify({ inputData: snapshot })
            );
        } else {
            snapshot = JSON.parse(stored).inputData || [];
        }

        const filtered = snapshot.filter(item => inputMap[item.label]);
        setStaticData(filtered);

    }, [inputData, inputMap]);

    /* ---------------------------------------------
       STORE ORIGINAL VALUES (Value 1)
    --------------------------------------------- */
    useEffect(() => {
        if (!allFormData?.inputData || originalInputData.length) return;

        const filtered = allFormData.inputData.filter(
            r => inputMap[r.label]
        );

        setOriginalInputData(filtered);
    }, [allFormData?.inputData, inputMap]);

    /* ---------------------------------------------
       INPUT CHANGE
    --------------------------------------------- */
    const handleInputChange = (key, value) => {
        const raw = String(value).trim();

        // Try numeric conversion
        const numeric = raw.replace(/,/g, '');
        const parsed = numeric !== '' && !isNaN(numeric) ? Number(numeric) : null;

        const finalValue = parsed !== null ? parsed : raw;

        setAllFormData(prev => ({
            ...prev,
            inputData: prev.inputData.map(item =>
                item.label === key
                    ? { ...item, value: finalValue }
                    : item
            ),
            [`${key}_value2`]: finalValue
        }));
    };


    /* ---------------------------------------------
       SUMMARY TABLE
    --------------------------------------------- */
    const summaryTableData = useMemo(() => {
        const rows = [];
        let totalRow = {
            labelKey: "material_cost",
            label: summaryMap.material_cost || "Total",
            inr: "",
            eur: "",
            pct: ""
        };

        (allFormData?.summaryData || []).forEach(item => {
            if (!summaryMap[item.label]) return;

            if (item.label === "material_cost") {
                if (item.currency === "INR") totalRow.inr = `${Number(item.value || 0).toFixed(0)}`;
                if (item.currency === "EUR") totalRow.eur = `${Number(item.value || 0).toFixed(0)}`;
                if (item.percent) totalRow.pct = `${(item.percent * 100).toFixed(0)}`;
                return;
            }

            let row = rows.find(r => r.labelKey === item.label);
            if (!row) {
                row = {
                    labelKey: item.label,
                    label: summaryMap[item.label],
                    inr: "",
                    eur: "",
                    pct: ""
                };
                rows.push(row);
            }

            if (item.currency === "INR") {
                row.inr = `${Number(item.value || 0).toFixed(0)}`;
                if (item.percent) row.pct = `${(item.percent * 100).toFixed(0)}`;
            }

            if (item.currency === "EUR") {
                row.eur = `${Number(item.value || 0).toFixed(0)}`;
            }
        });

        rows.push(totalRow);
        return rows;
    }, [allFormData?.summaryData, summaryMap]);

    const { inrHeader, eurHeader, percentHeader } = useMemo(() => {
        const defaultHeaders = { inrHeader: "INR/T", eurHeader: "EUR/T", percentHeader: "%" };
        if (!allFormData?.summaryData) return defaultHeaders;

        const detailsInr = allFormData.summaryData.find(item => item.label === 'details' && item.currency === 'INR');
        const detailsEur = allFormData.summaryData.find(item => item.label === 'details' && item.currency === 'EUR');

        return {
            inrHeader: detailsInr?.value || defaultHeaders.inrHeader,
            eurHeader: detailsEur?.value || defaultHeaders.eurHeader,
            percentHeader: detailsInr?.percent || defaultHeaders.percentHeader
        };
    }, [allFormData?.summaryData]);

    /* ---------------------------------------------
       RENDER
    --------------------------------------------- */
    return (
        <div
            className={`grid grid-cols-1 ${showPolymerPrices ? "lg:grid-cols-3" : "lg:grid-cols-2"
                } gap-2 border shadow-lg p-2`}
        >

            {/* INPUTS */}
            <div className="bg-gray-50 border rounded p-3">
                <h3 className="font-bold pb-3">Inputs</h3>
                {isLoading ? (
                    <div className="space-y-2">
                        {[0, 1, 2, 3].map(i => (
                            <div key={i} className="h-8 bg-gray-200 rounded animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <DataTable
                        columns={[
                            { key: 'label', title: 'Details' },
                            { key: 'unit', title: 'Unit' },
                            {
                                key: 'value',
                                title: 'Recommended Value',
                                render: r => {
                                    let formattedValue = "";

                                    if (r.value !== null && r.value !== undefined) {
                                        const num = Number(r.value);

                                        if (!isNaN(num) && typeof r.value !== "string") {
                                            // numeric (actual number type)
                                            formattedValue = Number.isInteger(num)
                                                ? num.toString()
                                                : num.toFixed(2);
                                        }
                                        else if (!isNaN(num) && typeof r.value === "string" && r.value.trim() !== "") {
                                            // numeric string
                                            formattedValue = Number.isInteger(num)
                                                ? num.toString()
                                                : num.toFixed(2);
                                        }
                                        else {
                                            // pure text
                                            formattedValue = String(r.value);
                                        }
                                    }

                                    return (
                                        <input
                                            readOnly
                                            value={formattedValue}
                                            className="w-full bg-gray-100 border px-2 py-0.5 text-sm"
                                        />
                                    );
                                }
                            },
                            {
                                key: 'value2',
                                title: 'Actual Value',
                                render: r => {
                                    const hasDropdown =
                                        Array.isArray(r.dropdownValues) && r.dropdownValues.length > 0;

                                    return hasDropdown ? (
                                        <select
                                            value={allFormData[`${r.key}_value2`] ?? r.value ?? ""}
                                            onChange={e => handleInputChange(r.key, e.target.value)}
                                            className="w-full border px-2 py-0.5 text-sm"
                                        >
                                            {r.dropdownValues.map(opt => (
                                                <option key={opt} value={opt}>
                                                    {opt}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            value={allFormData[`${r.key}_value2`] || ''}
                                            onChange={e => handleInputChange(r.key, e.target.value)}
                                            className="w-full border px-2 py-0.5 text-sm"
                                        />
                                    );
                                }
                            }
                        ]}
                        data={staticData.map(r => ({
                            key: r.label,
                            label: inputMap[r.label],
                            unit: r.unit || "-",
                            value: r.value,
                            dropdownValues: r.dropdownValues || []
                        }))}
                    />
                )}
            </div>

            {/* SUMMARY */}
            <div className="bg-gray-50 border rounded p-3">
                <h3 className="font-bold pb-3">Summary</h3>
                {loadingSummary || isLoading ? (
                    <div className="space-y-2">
                        {[0, 1, 2, 3].map(i => (
                            <div key={i} className="h-8 bg-gray-200 rounded animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <DataTable
                        columns={[
                            {
                                key: "label",
                                title: "Details",
                                render: (row) => (
                                    <span className={row.labelKey === "material_cost" ? "font-bold" : ""}>
                                        {row.label}
                                    </span>
                                )
                            },
                            { key: "inr", title: inrHeader, render: (row) => <span className={row.labelKey === "material_cost" ? "font-bold" : ""}>{row.inr}</span> },
                            { key: "eur", title: eurHeader, render: (row) => <span className={row.labelKey === "material_cost" ? "font-bold" : ""}>{row.eur}</span> },
                            { key: "pct", title: percentHeader, render: (row) => <span className={row.labelKey === "material_cost" ? "font-bold" : ""}>{row.pct}</span> }
                        ]}
                        data={summaryTableData}
                    />
                )}

            </div>

            {/* POLYMER PRICE */}
            {showPolymerPrices && (
                <div className="bg-gray-50 border rounded p-3 text-sm">
                    <h3 className="font-bold pb-3">Polymer Prices</h3>

                    {loadingPpRate ? (
                        <div className="space-y-2">
                            {[0, 1, 2, 3, 4].map(i => (
                                <div key={i} className="h-8 bg-gray-200 rounded animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        ppRate.length > 0 && <ApiDataTable data={ppRate} />
                    )}
                </div>
            )}

        </div>
    );
}
