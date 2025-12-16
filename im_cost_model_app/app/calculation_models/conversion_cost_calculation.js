'use client';
import React, { useState, useEffect } from 'react';
import DataTable from '../../components/ui/data-table';

export default function ConversionCostCalculation({
    allFormData,
    setAllFormData,
    loadingSummary
}) {
    const [originalInputData, setOriginalInputData] = useState([]);

    // Store the original input data on first load to preserve "Value 1"
    useEffect(() => {
        if (allFormData?.inputData && originalInputData.length === 0) {
            const conversionInputs = allFormData.inputData.filter(r => LABEL_MAP[r.label]);
            setOriginalInputData(conversionInputs);
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
                    return { ...item, value: finalValue !== '' ? finalValue : item.value };
                }
                return item;
            });
            return {
                ...prev,
                inputData: newInputData,
                [`${key}_value2`]: finalValue,
            };
        });
    };

    /* ---------------- INPUT LABEL MAP ---------------- */
    const LABEL_MAP = {
        electricity_rate: "Electricity Rate",

        skilled_labour: "Skilled Labour",
        engineer: "Engineer",
        production_manager: "Production Manager",

        repair_maintainance: "Repair & Maintainance",
        other_overheads: "Other Overheads",

        depreciation_plant: "Depreciation on Plant & Machinery",
        depreciation_building: "Depreciation on Building",
        completed_life_of_asset: "Completed life of asset",

        land_cost: "Land Cost",
        building_investment: "Building Investment",
        lease_cost: "Lease Cost",
        type_of_premises: "Type of Premises",

        interest_long_term: "Interest on Long Term Loan",
        interest_working_capital: "Interest on Working Capital",
        margin: "Margin",
        margin_calculation: "Margin Calculation",

        no_of_orders_per_year: "No of Orders / Year",

        caps_per_box: "Caps Per Box",
        boxes_per_pallet: "Boxes Per Pallet",
        pallet_type: "Pallet Type",
        type_of_container: "Type of Container",
        boxes_per_container: "Boxes Per Container",
        shipper_cost: "Shipper Cost",
        polybag_cost: "Polybag Cost",
        packing_cost: "Packing Cost",
        freight_cost_per_container: "Freight cost per container",

        days_per_year: "Days per Year",
        shifts_per_day: "Shifts per Day",
        hours_per_day: "Hours per Day",
        efficiency: "Efficiency",
        available_hours_per_year: "Available hours per year",

        eur_to_inr: "EUR to INR",
        usd_to_inr: "USD to INR",

        rm_payment_term: "RM Payment term",
        fg_payment_term: "FG Payment term",

        mould_cavitation: "Mould Cavitation",
        mould_cycle_time: "Mould Cycle Time",
        annual_volume: "Annual Volume"
    };

    /* ---------------- SUMMARY LABEL MAP ---------------- */
    const SUMMARY_LABEL_MAP = {
        conversion_cost: "Conversion Cost",
        electricity: "Electricity",
        "labour-direct": "Labour-Direct",
        "labour-indirect": "Labour-Indirect",
        "repair_&_maintenance": "Repair & Maintenance",
        other_overheads: "Other Overheads",
        lease: "Lease",
        depreciation: "Depreciation",
        interest: "Interest",
        margin: "Margin",
        distribution: "Distribution",
        packgaging: "Packgaging",
        freight: "Freight"
    };

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

    return (
        <div className="bg-white rounded-lg shadow-lg border p-2">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">

                {/* ---------------- INPUTS ---------------- */}
                <div className="bg-gray-50 border rounded p-3 h-57 overflow-auto print:h-auto print:overflow-visible">
                    <h3 className="font-bold pb-3">Inputs</h3>

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
                                    unit: r.unit || "-",
                                    value: r.value
                                }))
                        }
                    />
                </div>

                {/* ---------------- SUMMARY ---------------- */}
                <div className="bg-gray-50 border rounded p-3 h-57 overflow-auto print:h-auto print:overflow-visible">
                    <h3 className="font-bold pb-3">Summary</h3>

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
                </div>

            </div>
        </div>
    );
}