"use client";
import React, { useEffect, useState, useMemo } from "react";
import ConDataTable from "../../components/ui/conversion-data-table";

export default function MachineCostCalculation({allFormData, setAllFormData}) {
    const [loading, setLoading] = useState(true);
    
    // Keys you want to display
    const requiredKeys = [
        "mould_cavitation",
        "mould_cycle_time",
        // "machine_model_tonnage",
        // "no_of_setups_per_year",
        // "no_of_ramp_ups_per_year",
        "annual_volume"
    ];

    const toTitleCase = (str) => {
        return str
            .toLowerCase()
            .split("_")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    useEffect(() => {
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

    const initialInputData = useMemo(() => {
        return requiredKeys
            .filter(key => allFormData && allFormData[key] !== undefined)
            .map(key => ({
                name: toTitleCase(key),
                value: allFormData[key],
                key: key
            }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading]); // Only re-calculate when loading is finished.

    return (
        <div className="grid grid-cols-1 border shadow-lg md:grid-cols-3 gap-2 p-2">
            {/* Inputs Grid */}
            <div className="bg-gray-50 shadow-md p-2 h-57">
                <div className="rounded overflow-auto h-full">
                    <h3 className="font-bold pb-3">Inputs</h3>
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <ConDataTable
                            columns={[
                                { accessorKey: 'name', header: 'Label', cell: ({ row }) => <div className="text-sm">{row.original.name}</div> },
                                { accessorKey: 'rate1', header: 'Rate', cell: ({ row }) => <input type="text" value={row.original.value ?? ''} readOnly className="w-full px-2 py-0.5 text-sm bg-gray-100 border border-gray-300" /> },
                                { accessorKey: 'rate2', header: 'Rate', cell: ({ row }) => <input type="text" value={allFormData[`${row.original.key}_rate2`] || ''} onChange={(e) => handleInputChange(row.original.key, e.target.value)} className="w-full px-2 py-0.5 text-sm border border-gray-300" /> }
                            ]}
                            data={initialInputData}
                        />
                    )}
                </div>
            </div>

            {/* Summary / Results Grid */}
            <div>
                <div className="bg-gray-50 shadow-md p-3 h-57 overflow-auto">
                    <h3 className="font-bold pb-3">Summary</h3>
                    {/* Summary content will go here */}
                </div>
            </div>

            {/* API Request Data from 3rd Party App Grid */}
            <div>
                <div className="bg-white shadow-md p-5 h-full">
                    <h2 className="text-sm font-semibold mb-4">API Request Data from 3rd Party App</h2>
                    {/* 3rd party app data content will go here */}
                </div>
            </div>
        </div>
    );
}
