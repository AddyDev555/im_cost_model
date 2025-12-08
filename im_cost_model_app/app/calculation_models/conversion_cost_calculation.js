'use client';
import React, { useState, useEffect } from 'react';
import ConDataTable from '../../components/ui/conversion-data-table';

const ConversionCostCalculation = () => {
    const [inputData, setInputData] = useState([]);
    const [summaryData, setSummaryData] = useState([]);
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
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:8000/api/conversion/get-conversion-cost-inputs');
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
                }

                const responseData = await response.json();
                if (responseData.success) {
                    const allData = responseData.data;
                    const inputs = [];
                    const summary = [
                        { label: "Conversion Cost", key: "conversion_cost" },
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
                    ].map(item => ({
                        label: item.label,
                        inr: allData[`${item.key}_inr`],
                        eur: allData[`${item.key}_eur`],
                        per: allData[`${item.key}_per`],
                    }));

                    Object.entries(allData).forEach(([key, value]) => {
                        if (conversionCostLabelMap[key]) {
                        let val = String(value).trim().replace(/,/g, ''); // remove commas & spaces
                        const label = conversionCostLabelMap[key] || key;
                        if (percentageFields.includes(label) && val.endsWith('%')) {
                            val = val.slice(0, -1);
                        }
                        inputs.push({ name: label, value: val });
                        }
                    });

                    setInputData(inputs);
                    setSummaryData(summary);
                } else {
                    setError(responseData.error || 'Failed to fetch data');
                }
            } catch (e) {
                setError(`An error occurred while fetching data: ${e.message}`);
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleInputChange = (index, value) => {
        const updatedData = [...inputData];

        // Remove commas and parse float
        let parsed = value === '' ? '' : parseFloat(String(value).replace(/,/g, ''));
        parsed = isNaN(parsed) ? '' : parsed;

        updatedData[index].value = parsed;
        setInputData(updatedData);
    };

    const prepareDataForSave = () => {
        const saveData = {};
        inputData.forEach(item => {
            let val = item.value;
            // Add % back if field is a percentage and value is not empty
            if (percentageFields.includes(item.name) && val !== '') {
                val = `${val}%`;
            }
            saveData[item.name] = val;
        });
        return saveData;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-2">
            {/* Inputs Grid */}
            <div className="bg-gray-50 shadow-md rounded p-2 h-50">
                <div className="rounded overflow-auto p-2 h-full">
                    {loading ? (
                        <div>
                            {Array.from({ length: 15 }).map((_, index) => (
                                <div key={index} className="grid grid-cols-2 gap-4 items-center py-2.5">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <ConDataTable
                            columns={[
                                { accessorKey: 'name', header: 'Label' },
                                { accessorKey: 'value', header: 'Value', cell: ({ row }) => <input type="text" value={row.original.value} onChange={(e) => handleInputChange(row.index, e.target.value)} className="w-full px-2 py-0.5 text-sm border border-gray-300 rounded" /> }
                            ]}
                            data={inputData}
                        />
                    )}
                </div>
            </div>

            {/* Summary / Results Grid */}
            <div>
                <div className="bg-gray-50 shadow-md rounded p-3 h-50 overflow-auto">
                    {loading ? (
                        <div>
                            {/* Skeleton loader for summary table */}
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
                        <>
                            <ConDataTable
                                columns={[
                                    { accessorKey: 'label', header: 'Label' },
                                    { accessorKey: 'inr', header: 'INR/1000' },
                                    { accessorKey: 'eur', header: 'EUR/1000' },
                                    { accessorKey: 'per', header: '% of Total' },
                                ]}
                                data={summaryData}
                            />
                            <button
                                className="relative bottom-0 left-0 w-full bg-blue-500 text-white font-semibold py-3 rounded-b-lg"
                                onClick={() => {
                                    const dataToSave = prepareDataForSave();
                                    console.log("Data ready to save:", dataToSave);
                                }}
                            >
                                Calculate
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* API Request Data from 3rd Party App Grid */}
            <div>
                <div className="bg-white shadow-md rounded-lg p-5 h-full">
                    <h2 className="text-sm font-semibold mb-4">API Request Data from 3rd Party App</h2>
                </div>
            </div>
        </div>
    );
};

export default ConversionCostCalculation;
