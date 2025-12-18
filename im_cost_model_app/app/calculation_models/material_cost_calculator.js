'use client';
import React, { useEffect, useMemo, useState } from 'react';
import DataTable from '../../components/ui/data-table';
import ApiDataTable from '../../components/ui/api-table';
import { api } from "@/utils/api";
import { IMCostModelMapper, CartonCostModel } from "../costingModels/models";

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

        default:
            return { inputMap: {}, summaryMap: {} };
    }
}

export default function MaterialCalculator({
    sheetName,          // im_cost_model | carton_cost_model
    allFormData,
    setAllFormData,
    loadingSummary
}) {
    const [ppRate, setPpRate] = useState([]);
    const [originalInputData, setOriginalInputData] = useState([]);
    const [loadingPpRate, setLoadingPpRate] = useState(false);

    /* ---------------------------------------------
       DYNAMIC MAPPING
    --------------------------------------------- */
    const { inputMap, summaryMap } = useMemo(
        () => resolveMappings(sheetName),
        [sheetName]
    );

    /* ---------------------------------------------
       POLYMER PRICES (IM only)
    --------------------------------------------- */
    useEffect(() => {
        const fetchPPData = async () => {
            setLoadingPpRate(true);
            try {
                const json = await api.get("/api/material/pp-rate");
                setPpRate(json.data || []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoadingPpRate(false);
            }
        };

        fetchPPData();
    }, [sheetName]);

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
        const cleaned = value.replace(/,/g, '');
        const parsed = cleaned === '' ? '' : Number(cleaned);

        setAllFormData(prev => ({
            ...prev,
            inputData: prev.inputData.map(item =>
                item.label === key
                    ? { ...item, value: parsed === '' ? item.value : parsed }
                    : item
            ),
            [`${key}_value2`]: parsed
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
                if (item.currency === "INR") totalRow.inr = `₹${Number(item.value || 0).toFixed(0)}`;
                if (item.currency === "EUR") totalRow.eur = `€${Number(item.value || 0).toFixed(0)}`;
                if (item.percent) totalRow.pct = `${(item.percent * 100).toFixed(0)}%`;
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
                row.inr = `₹${Number(item.value || 0).toFixed(0)}`;
                if (item.percent) row.pct = `${(item.percent * 100).toFixed(0)}%`;
            }

            if (item.currency === "EUR") {
                row.eur = `€${Number(item.value || 0).toFixed(0)}`;
            }
        });

        rows.push(totalRow);
        return rows;
    }, [allFormData?.summaryData, summaryMap]);

    /* ---------------------------------------------
       RENDER
    --------------------------------------------- */
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 border shadow-lg p-2">

            {/* INPUTS */}
            <div className="bg-gray-50 border rounded p-3 h-59 overflow-auto print:h-auto print:overflow-visible">
                <h3 className="font-bold pb-3">Inputs</h3>

                <DataTable
                    columns={[
                        { key: 'label', title: 'Label' },
                        { key: 'unit', title: 'Unit' },
                        {
                            key: 'value',
                            title: 'Value 1',
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
                            render: r => (
                                <input
                                    value={allFormData[`${r.key}_value2`] || ''}
                                    onChange={e => handleInputChange(r.key, e.target.value)}
                                    className="w-full border px-2 py-0.5 text-sm"
                                />
                            )
                        }
                    ]}
                    data={originalInputData.map(r => ({
                        key: r.label,
                        label: inputMap[r.label],
                        unit: r.unit,
                        value: r.value
                    }))}
                />
            </div>

            {/* SUMMARY */}
            <div className="bg-gray-50 border rounded p-3 h-59 overflow-auto print:h-auto print:overflow-visible">
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
                                title: "Material",
                                render: (row) => (
                                    <span className={row.labelKey === "material_cost" ? "font-bold" : ""}>
                                        {row.label}
                                    </span>
                                )
                            },
                            { key: "inr", title: "INR/T", render: (row) => <span className={row.labelKey === "material_cost" ? "font-bold" : ""}>{row.inr}</span> },
                            { key: "eur", title: "EUR/T", render: (row) => <span className={row.labelKey === "material_cost" ? "font-bold" : ""}>{row.eur}</span> },
                            { key: "pct", title: "%", render: (row) => <span className={row.labelKey === "material_cost" ? "font-bold" : ""}>{row.pct}</span> }
                        ]}
                        data={summaryTableData}
                    />
                )}

            </div>

            {/* POLYMER PRICE */}
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
        </div>
    );
}
