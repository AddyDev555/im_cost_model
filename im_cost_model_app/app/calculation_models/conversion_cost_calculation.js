'use client';
import React, { useState, useEffect } from 'react';
import ConDataTable from '../../components/ui/conversion-data-table';

const ConversionCostCalculation = ({ allFormData, setAllFormData }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const percentageFields = [
        "Interest on Long Term Loan",
        "Interest on Working Capital",
        "Depreciation on Plant Machinery",
        "margin",
        "Efficiency",
        "Repair & Maintenance",
        "Other Overheads",
        "Depreciation on Building"
    ];

    const conversionCostLabelMap = {
        electricity_rate: "Electricity Rate",
        skilled_labour_rate: "Skilled Labour Rate",
        engineer_rate: "Engineer Rate",
        production_manager: "Production Manager",
        repair_maintainance: "Repair & Maintenance",
        other_overheads: "Other Overheads",
        depreciation_on_plant_machinery: "Depreciation on Plant Machinery",
        depreciation_on_building: "Depreciation on Building",
        completed_life_of_asset: "Completed Life of Asset",
        land_cost: "Land Cost",
        building_investment: "Building Investment",
        lease_cost: "Lease Cost",
        type_of_premises: "Type of Premises",
        interest_on_long_term_loan: "Interest on Long Term Loan",
        interest_on_working_capital: "Interest on Working Capital",
        Margin: "Margin",
        margin_calculation: "Margin Calculation",
        no_of_orders_per_year: "No of Orders per Year",
        caps_per_box: "Caps per Box",
        boxes_per_pallet: "Boxes per Pallet",
        pallet_type: "Pallet Type",
        type_of_container: "Type of Container",
        boxes_per_container: "Boxes per Container",
        shipper_cost: "Shipper Cost",
        polybag_cost: "Polybag Cost",
        packing_cost: "Packing Cost",
        freight_cost_per_container: "Freight Cost per Container",
        days_per_year: "Days per Year",
        shifts_per_day: "Shifts per Day",
        hours_per_day: "Hours per Day",
        efficiency: "Efficiency",
        available_hours_per_year: "Available Hours per Year"
    };

    useEffect(() => {
        // If data already exists in allFormData, loading can be set to false immediately
        if (allFormData && Object.keys(allFormData).length > 0) {
            setLoading(false);
        }
    }, [allFormData]);

    const handleInputChange = (label, value) => {
        const cleanedValue = String(value).replace(/,/g, '');
        const parsedValue = cleanedValue === '' ? '' : parseFloat(cleanedValue);

        setAllFormData(prev => ({
            ...prev,
            [label]: isNaN(parsedValue) ? '' : parsedValue
        }));
    };

    const prepareDataForSave = () => {
        const saveData = {};
        for (const [key, value] of Object.entries(allFormData)) {
            let val = value;
            if (percentageFields.includes(key) && val !== '') {
                val = `${val}%`;
            }
            saveData[key] = val;
        }
        return saveData;
    };

    // Generate input table data from allFormData
    const inputTableData = Object.entries(allFormData || {}).map(([key, value]) => {
        if (!conversionCostLabelMap[key]) return null;
        return {
            name: conversionCostLabelMap[key],
            value1: typeof value === 'number' ? value.toFixed(2) : value,
            value2: typeof value === 'number' ? value.toFixed(2) : value
        };
    }).filter(Boolean);

    // Generate summary table data from allFormData
    const summaryKeys = [
        { label: "Conversion", key: "conversion_cost" },
        { label: "Electricity", key: "electricity" },
        { label: "Labour-Direct", key: "labour_direct" },
        { label: "Labour-Indirect", key: "labour_indirect" },
        { label: "Repair & Maintenance", key: "repair_maintenance" },
        { label: "Other Overheads", key: "overheads" },
        { label: "Lease", key: "lease_cost" },
        { label: "Depreciation", key: "depreciation" },
        { label: "Interest", key: "interest" },
        { label: "Margin", key: "margin" },
        { label: "Distribution", key: "distribution" },
        { label: "Packaging", key: "packgaging" },
        { label: "Freight", key: "freight" },
    ];

    const summaryTableData = summaryKeys.map(item => {
        const formatValue = (val) => {
            const num = parseFloat(val);
            return isNaN(num) ? '0.00' : num.toFixed(2);
        };
        return {
            label: item.label,
            inr: `₹${formatValue(allFormData[`${item.key}_inr`])}`,
            eur: `€${formatValue(allFormData[`${item.key}_eur`])}`,
            per: `${formatValue(allFormData[`${item.key}_per`])}%`,
        };
    });

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 px-2 pt-2 pb-0">
            {/* Inputs Grid */}
            <div className="bg-gray-50 shadow-md rounded p-2 h-50">
                <div className="rounded overflow-auto h-full">
                    <h3 className="font-bold pb-3">Inputs</h3>
                    {loading ? (
                        <div>
                            {Array.from({ length: 15 }).map((_, index) => (
                                <div key={index} className="grid grid-cols-2 gap-4 items-center py-2.5">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse col-span-1" />
                                    <div className="h-4 bg-gray-200 rounded animate-pulse col-span-1" />
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <ConDataTable
                            columns={[
                                { accessorKey: 'name', header: 'Label' },
                                { accessorKey: 'value1', header: 'Rate 1', cell: ({ row }) => <input type="text" value={row.original.value1 ?? ''} readOnly className="w-full px-2 py-0.5 text-sm bg-gray-100 border border-gray-300" /> },
                                { accessorKey: 'value2', header: 'Rate 2', cell: ({ row }) => <input type="text" onChange={(e) => handleInputChange(row.original.name, e.target.value)} className="w-full px-2 py-0.5 text-sm border border-gray-300" /> }
                            ]}
                            data={inputTableData}
                        />
                    )}
                </div>
            </div>

            {/* Summary Grid */}
            <div>
                <div className="bg-gray-50 shadow-md rounded p-3 h-50 overflow-auto">
                    <h3 className="font-bold pb-3">Summary</h3>
                    {loading ? (
                        <div>
                            {Array.from({ length: 13 }).map((_, index) => (
                                <div key={index} className="grid grid-cols-4 gap-4 items-center py-2.5">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <ConDataTable
                            columns={[
                                { accessorKey: 'label', header: 'Details' },
                                { accessorKey: 'inr', header: 'INR/T' },
                                { accessorKey: 'eur', header: 'EUR/T' },
                                { accessorKey: 'per', header: '%' },
                            ]}
                            data={summaryTableData}
                        />
                    )}
                </div>
            </div>

            {/* API Data Grid */}
            <div>
                <div className="bg-white shadow-md rounded-lg p-5 h-full">
                    <h2 className="text-sm font-semibold mb-4">API Request Data from 3rd Party App</h2>
                </div>
            </div>
        </div>
    );
};

export default ConversionCostCalculation;