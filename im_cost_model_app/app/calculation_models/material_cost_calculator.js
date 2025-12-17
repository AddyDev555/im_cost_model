'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';
import DataTable from '../../components/ui/data-table';
import ApiDataTable from '../../components/ui/api-table';
import { api } from "@/utils/api";
import { IMCostModelMapper } from "../costingModels/models";

export default function MaterialCalculator({ allFormData, setAllFormData, loadingSummary }) {
    const [showShot2, setShowShot2] = useState(false);
    const [ppRate, setPpRate] = useState([]);
    const [originalInputData, setOriginalInputData] = useState([]);

    /* ---------------- Fetch Polymer Prices ---------------- */
    useEffect(() => {
        async function fetchPPData() {
            try {
                const json = await api.get("/api/material/pp-rate");
                setPpRate(json.data || []);
            } catch (err) {
                console.error("Failed to fetch PP data:", err);
            }
        }
        fetchPPData();
    }, []);

    // Store the original input data on first load to preserve "Value 1"
    useEffect(() => {
        if (allFormData?.inputData && originalInputData.length === 0) {
            const materialInputs = allFormData.inputData.filter(r => LABEL_MAP[r.label]);
            setOriginalInputData(materialInputs);
        }
    }, [allFormData?.inputData]);

    /* ---------------- Input Change Handler ---------------- */
    const handleInputChange = (key, value) => {
        const cleanedValue = String(value).replace(/,/g, '');
        const parsedValue = cleanedValue === '' ? '' : parseFloat(cleanedValue);
        const finalValue = isNaN(parsedValue) ? '' : parsedValue;

        setAllFormData(prev => {
            const newInputData = prev.inputData.map(item => {
                if (item.label === key) {
                    // Create a new object to avoid direct state mutation
                    return { ...item, value: finalValue !== '' ? finalValue : item.value };
                }
                return item;
            });

            return {
                ...prev,
                inputData: newInputData,
                [`${key}_value2`]: finalValue, // Keep storing value2 for the input field
            };
        });
    };

    /* ---------------- Label Mapping (UI Friendly) ---------------- */
    const LABEL_MAP = IMCostModelMapper.material_inputs;

    /* ---------------- Summary Label Mapping ---------------- */
    const SUMMARY_LABEL_MAP = IMCostModelMapper.material_summary;

    const summaryTableData = [];
    let totalRow = { labelKey: "material_cost", label: "Total", inr: "", eur: "", pct: "" };

    (allFormData?.summaryData || []).forEach(curr => {
        if (!SUMMARY_LABEL_MAP[curr.label]) return;

        if (curr.label === "material_cost") {
            // assign currencies to total row
            if (curr.currency === "INR") totalRow.inr = `₹${Number(curr.value || 0).toFixed(0)}`;
            if (curr.currency === "EUR") totalRow.eur = `€${Number(curr.value || 0).toFixed(0)}`;
            if (curr.percent) totalRow.pct = `${(Number(curr.percent) * 100).toFixed(0)}%`;
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
            existing.pct = curr.percent ? `${(Number(curr.percent) * 100).toFixed(0)}%` : "";
        } else if (curr.currency === "EUR") {
            existing.eur = `€${Number(curr.value || 0).toFixed(0)}`;
        }
    });

    // push total at the end
    summaryTableData.push(totalRow);



    return (
        <div className="w-full px-1">
            <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
                <form className="overflow-x-auto">
                    <div className={`grid gap-0 ${showShot2 ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
                        <div className={`pb-2 sm:px-2 py-0 border-b ${showShot2 ? 'lg:border-r' : ''}`}>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">

                                {/* ---------------- Inputs ---------------- */}
                                <div className="bg-gray-50 border rounded p-3 h-57 overflow-auto print:h-auto print:overflow-visible">
                                    <h3 className='font-bold pb-3'>Inputs</h3>
                                    <DataTable
                                        columns={[
                                            { key: 'label', title: 'Label', render: (row) => <div className="text-sm">{row.label}</div> },
                                            { key: 'unit', title: 'Unit', render: (row) => <div className="text-sm">{row.unit}</div> },
                                            {
                                                key: 'value',
                                                title: 'Value 1',
                                                render: (row) => (
                                                    <input
                                                        type="text"
                                                        value={row.value ?? ""}
                                                        readOnly
                                                        className="w-full bg-gray-100 px-2 py-0.5 text-sm border border-gray-300"
                                                    />
                                                )
                                            },
                                            {
                                                key: 'value2',
                                                title: 'Value 2',
                                                render: (row) => <input
                                                    type="text"
                                                    value={allFormData[`${row.key}_value2`] || ''}
                                                    onChange={(e) => handleInputChange(row.key, e.target.value)} className="w-full px-2 py-0.5 text-sm border border-gray-300" />
                                            },
                                        ]}
                                        data={
                                            (originalInputData || [])
                                                .map(r => ({
                                                    key: r.label,
                                                    label: LABEL_MAP[r.label],
                                                    unit: r.unit,
                                                    value: r.value
                                                }))
                                        }
                                    />

                                </div>

                                {/* ---------------- Summary ---------------- */}
                                <div>
                                    <div className="bg-gray-50 border rounded h-57 p-3 print:h-auto print:overflow-visible">
                                        <h3 className='font-bold pb-3'>Summary</h3>

                                        <DataTable
                                            columns={[
                                                {
                                                    key: "label",
                                                    title: "Material",
                                                    render: (row) => (
                                                        <span className={row.labelKey === "material_cost" ? "font-bold" : ""}>
                                                            {row.label}
                                                        </span>
                                                    )
                                                },
                                                {
                                                    key: "inr",
                                                    title: "INR/T",
                                                    render: (row) => (
                                                        <span className={row.labelKey === "material_cost" ? "font-bold" : ""}>
                                                            {row.inr}
                                                        </span>
                                                    )
                                                },
                                                {
                                                    key: "eur",
                                                    title: "EUR/T",
                                                    render: (row) => (
                                                        <span className={row.labelKey === "material_cost" ? "font-bold" : ""}>
                                                            {row.eur}
                                                        </span>
                                                    )
                                                },
                                                {
                                                    key: "pct",
                                                    title: "%",
                                                    render: (row) => (
                                                        <span className={row.labelKey === "material_cost" ? "font-bold" : ""}>
                                                            {row.pct}
                                                        </span>
                                                    )
                                                }
                                            ]}
                                            data={summaryTableData}
                                        />


                                    </div>
                                </div>

                                {/* ---------------- Polymer Prices ---------------- */}
                                <div>
                                    <div className="bg-gray-50 border rounded h-57 p-3 text-sm print:h-auto print:overflow-visible">
                                        <h3 className='font-bold pb-3'>Polymer Prices</h3>
                                        <ApiDataTable data={ppRate} />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
