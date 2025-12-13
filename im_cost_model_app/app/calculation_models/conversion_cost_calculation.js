'use client';
import React, { useState, useEffect, useMemo } from 'react';
import ConDataTable from '../../components/ui/conversion-data-table';

const ConversionCostCalculation = ({ allFormData, setAllFormData, loadingSummary }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const percentageFields = [
        "Interest on Long Term Loan",
        "Interest on Working Capital",
        "Depreciation on Plant Machinery",
        "Margin",
        "Repair & Maintenance",
        "Other Overheads",
        "Depreciation on Building",
        "Efficiency"
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

    const handleInputChange = (key, value) => {
        const cleanedValue = String(value).replace(/,/g, '');
        const parsedValue = cleanedValue === '' ? '' : parseFloat(cleanedValue);
        const finalValue = isNaN(parsedValue) ? '' : parsedValue;
 
        setAllFormData(prev => ({
            ...prev,
            // Store the new value in a separate key for the 'rate2' input
            [`${key}_rate2`]: finalValue,
            // If the new value is a valid number, overwrite the original rate value
            // This will be used in calculations but not displayed in the 'rate1' input.
            ...(finalValue !== '' && { [key]: finalValue })
        }));
    };

    const getKeyFromLabel = (label) => {
        for (const key in conversionCostLabelMap) {
            if (conversionCostLabelMap[key] === label) return key;
        }
        return null;
    };

    // Generate input table data from allFormData
    const initialInputData = useMemo(() => {
        return Object.entries(allFormData || {})
            .map(([key, value]) => {
                if (!conversionCostLabelMap[key] || key.endsWith('_rate2')) {
                    return null;
                }
                return {
                    name: conversionCostLabelMap[key],
                    value: value,
                    isPercentage: percentageFields.includes(conversionCostLabelMap[key]),
                };
            })
            .filter(Boolean);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allFormData, loading]); // Only re-calculate when loading is finished.

    // Generate summary table data from allFormData
    const summaryKeys = [
        { label: "Total", key: "conversion_cost" },
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
        <div className="grid grid-cols-1 shadow-lg border md:grid-cols-2 gap-2 px-2 py-2">
            {/* Inputs Grid */}
            <div className="bg-gray-50 shadow-md p-2 h-50 print:h-auto">
                <div className="overflow-auto print:overflow-visible h-full">
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
                                { accessorKey: 'name', header: 'Label', cell: ({ row }) => <div className="text-sm">{row.original.name}</div> },
                                {
                                    accessorKey: 'ratio', header: 'Ratio', cell: ({ row }) => {
                                        const { value, isPercentage } = row.original;
                                        if (!isPercentage) {
                                            return <div className="w-full px-2 py-0.5 text-sm text-center">-</div>;
                                        }
                                        return <input type="text" value={value ?? ''} readOnly className="w-full px-2 py-0.5 text-sm bg-gray-100 border border-gray-300" />;
                                    }
                                },
                                {
                                    accessorKey: 'rate1', header: 'Rate (INR)', cell: ({ row }) => {
                                        const { value, isPercentage } = row.original;
                                        if (isPercentage) {
                                            return <div className="w-full px-2 py-0.5 text-sm text-center">-</div>;
                                        }
                                        const key = getKeyFromLabel(row.original.name);
                                        const rate2Value = allFormData[`${key}_rate2`];
                                        
                                        // If rate2 has a value and it's different from the backend value, it means the user has provided a new rate.
                                        // In that case, we want to display the original backend value in the rate1 column.
                                        const displayValue = (rate2Value !== undefined && rate2Value !== '' && rate2Value !== value) ? value : allFormData[key];

                                        return <input type="text" value={displayValue ?? ''} readOnly className="w-full px-2 py-0.5 text-sm bg-gray-100 border border-gray-300" />
                                    }
                                },
                                {
                                    accessorKey: 'rate2', header: 'Rate (INR)', cell: ({ row }) => {
                                        const { name, value, isPercentage } = row.original;
                                        const key = getKeyFromLabel(name);
                                        if (isPercentage) {
                                            return <div className="w-full px-2 py-0.5 text-sm text-center">-</div>;
                                        }
                                        // For non-percentage fields, show an empty input for new values.
                                        const rate2Value = allFormData[`${key}_rate2`] ?? '';
                                        return <input type="text" value={rate2Value} onChange={(e) => handleInputChange(key, e.target.value)} className="w-full px-2 py-0.5 text-sm border border-gray-300" />;
                                    }
                                }
                            ]}
                            data={initialInputData}
                        />
                    )}
                </div>
            </div>

            {/* Summary Grid */}
            <div>
                <div className="bg-gray-50 shadow-md p-3 h-50 overflow-auto print:h-auto print:overflow-visible">
                    <h3 className="font-bold pb-3">Summary</h3>
                    {loadingSummary ? (
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
                                { 
                                    accessorKey: 'label', header: 'Details',
                                    cell: ({ row }) => <div className={row.original.label === 'Total' ? 'font-bold' : ''}>{row.original.label}</div>
                                },
                                { 
                                    accessorKey: 'inr', header: 'INR/T',
                                    cell: ({ row }) => <div className={row.original.label === 'Total' ? 'font-bold' : ''}>{row.original.inr}</div>
                                },
                                { 
                                    accessorKey: 'eur', header: 'EUR/T',
                                    cell: ({ row }) => <div className={row.original.label === 'Total' ? 'font-bold' : ''}>{row.original.eur}</div>
                                },
                                { 
                                    accessorKey: 'per', header: '%',
                                    cell: ({ row }) => <div className={row.original.label === 'Total' ? 'font-bold' : ''}>{row.original.per}</div>
                                },
                            ]}
                            data={summaryTableData}
                        />
                    )}
                </div>
            </div>

            {/* API Data Grid */}
            {/* <div>
                <div className="bg-white shadow-md p-5 h-full">
                    <h2 className="text-sm font-semibold mb-4">API Request Data from 3rd Party App</h2>
                </div>
            </div> */}
        </div>
    );
};

export default ConversionCostCalculation;