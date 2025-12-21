'use client';
import React, { useState, useEffect } from 'react';
import DataTable from '../../components/ui/data-table';
import { IMCostModelMapper, CartonCostModel, CorrugateCostModel, RigidEBMCostModel, RigidISBM1CostModel, RigidISBM2CostModel } from "../costingModels/models";

function resolveConversionMappings(sheetName) {
    switch (sheetName) {
        case "im_cost_model":
            return {
                inputMap: IMCostModelMapper.conversion_inputs,
                summaryMap: IMCostModelMapper.conversion_summary
            };

        case "carton_cost_model":
            return {
                inputMap: CartonCostModel.conversion_inputs || {},
                summaryMap: CartonCostModel.conversion_summary || {}
            };

        case "corrugate_cost_model":
            return {
                inputMap: CorrugateCostModel.conversion_inputs || {},
                summaryMap: CorrugateCostModel.conversion_summary || {},
            };

        case "rigid_ebm_cost_model":
            return {
                inputMap: RigidEBMCostModel.conversion_inputs || {},
                summaryMap: RigidEBMCostModel.conversion_summary || {},
            };

        case "rigid_isbm1_cost_model":
            return {
                inputMap: RigidISBM1CostModel.conversion_inputs || {},
                summaryMap: RigidISBM1CostModel.conversion_summary || {},
            };

        case "rigid_isbm2_cost_model":
            return {
                inputMap: RigidISBM2CostModel.conversion_inputs || {},
                summaryMap: RigidISBM2CostModel.conversion_summary || {},
            };

        default:
            return { inputMap: {}, summaryMap: {} };
    }
}
export default function ConversionCostCalculation({
    allFormData,
    setAllFormData,
    loadingSummary,
    sheetName
}) {
    const [originalInputData, setOriginalInputData] = useState([]);
    const [staticData, setStaticData] = useState([]);
    const inputData = allFormData?.inputData || [];

    // Store the original input data on first load to preserve "Value 1"
    useEffect(() => {
        if (allFormData?.inputData && originalInputData.length === 0) {
            const conversionInputs = allFormData.inputData.filter(r => LABEL_MAP[r.label]);
            setOriginalInputData(conversionInputs);
        }
    }, [allFormData?.inputData]);


    /* ---------------- Input Change Handler ---------------- */
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


    const { inputMap: LABEL_MAP, summaryMap: SUMMARY_LABEL_MAP } =
        resolveConversionMappings(sheetName);

    /* ---------------- SUMMARY TABLE BUILD ---------------- */
    const summaryTableData = [];
    let totalRow = {
        labelKey: "conversion_cost",
        label: "Conversion Cost",
        inr: "",
        eur: "",
        pct: ""
    };

    (allFormData?.summaryData || []).forEach(curr => {
        if (!SUMMARY_LABEL_MAP[curr.label]) return;

        if (curr.label === "conversion_cost") {
            if (curr.currency === "INR")
                totalRow.inr = `₹${Number(curr.value || 0).toFixed(0)}`;
            if (curr.currency === "EUR")
                totalRow.eur = `€${Number(curr.value || 0).toFixed(0)}`;
            if (curr.percent)
                totalRow.pct = `${(Number(curr.percent) * 100).toFixed(0)}%`;
            return;
        }

        let existing = summaryTableData.find(r => r.labelKey === curr.label);
        if (!existing) {
            existing = {
                labelKey: curr.label,
                label: SUMMARY_LABEL_MAP[curr.label],
                inr: "",
                eur: "",
                pct: ""
            };
            summaryTableData.push(existing);
        }

        if (curr.currency === "INR") {
            existing.inr = `₹${Number(curr.value || 0).toFixed(0)}`;
            existing.pct = curr.percent
                ? `${(Number(curr.percent) * 100).toFixed(0)}%`
                : "";
        }

        if (curr.currency === "EUR") {
            existing.eur = `€${Number(curr.value || 0).toFixed(0)}`;
        }
    });

    summaryTableData.push(totalRow);

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

        const filtered = snapshot.filter(item => LABEL_MAP[item.label]);
        setStaticData(filtered);

    }, [inputData, LABEL_MAP]);

    return (
        <div className="bg-white rounded shadow-lg border p-2">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">

                {/* ---------------- INPUTS ---------------- */}
                <div className="bg-gray-50 border rounded p-3">
                    <h3 className="font-bold pb-3">Inputs</h3>

                    <DataTable
                        columns={[
                            { key: 'label', title: 'Details' },
                            { key: 'unit', title: 'Unit' },
                            {
                                key: 'value',
                                title: 'Suggested',
                                render: r => (
                                    <input
                                        readOnly
                                        value={r.value ?? ""}
                                        className="w-full bg-gray-100 border px-2 py-0.5 text-sm"
                                    />
                                )
                            },
                            {
                                key: 'value2',
                                title: 'Value 2',
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
                            label: LABEL_MAP[r.label],
                            unit: r.unit || "-",
                            value: r.value,
                            dropdownValues: r.dropdownValues || []
                        }))}
                    />

                </div>

                {/* ---------------- SUMMARY ---------------- */}
                <div className="bg-gray-50 border rounded p-3">
                    <h3 className="font-bold pb-3">Summary</h3>

                    {loadingSummary ? (
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
                                        <span className={row.labelKey === "conversion_cost" ? "font-bold" : ""}>
                                            {row.label}
                                        </span>
                                    )
                                },
                                {
                                    key: "inr",
                                    title: "INR/T",
                                    render: (row) => (
                                        <span className={row.labelKey === "conversion_cost" ? "font-bold" : ""}>
                                            {row.inr}
                                        </span>
                                    )
                                },
                                {
                                    key: "eur",
                                    title: "EUR/T",
                                    render: (row) => (
                                        <span className={row.labelKey === "conversion_cost" ? "font-bold" : ""}>
                                            {row.eur}
                                        </span>
                                    )
                                },
                                {
                                    key: "pct",
                                    title: "%",
                                    render: (row) => (
                                        <span className={row.labelKey === "conversion_cost" ? "font-bold" : ""}>
                                            {row.pct}
                                        </span>
                                    )
                                }
                            ]}
                            data={summaryTableData}
                        />
                    )}
                </div>

            </div>
        </div>
    );
}