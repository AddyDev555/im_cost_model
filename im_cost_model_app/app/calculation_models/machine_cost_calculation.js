"use client";
import React, { useEffect, useState } from "react";
import DataTable from "../../components/ui/data-table";

export default function MaterialCostCalculation() {
    const [rows, setRows] = useState([]);

    // Keys you want to display
    const requiredKeys = [
        "mould_cavitation",
        "mould_cycle_time",
        "machine_model_tonnage",
        "no_of_setups_per_year",
        "no_of_ramp_ups_per_year",
    ];

    // Load data from localStorage
    useEffect(() => {
        const stored = localStorage.getItem("inputsData");
        if (!stored) return;

        const parsed = JSON.parse(stored);

        // Filter & prepare rows for table
        function toTitleCase(str) {
            return str
                .toLowerCase()
                .split("_")
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
        }

        const formatted = requiredKeys
            .filter((key) => parsed[key] !== undefined)
            .map((key) => ({
                key,
                label: toTitleCase(key),   // <-- Title Case here
                value: parsed[key],
            }));

        setRows(formatted);
    }, []);

    // Update value handler
    const updateRowValue = (index, newValue) => {
        const updated = [...rows];
        updated[index].value = newValue;
        setRows(updated);
    };

    // DataTable columns
    const columns = [
        {
            title: "Description",
            key: "label",
        },
        {
            title: "Value",
            key: "value",
            render: (row, index) => (
                <input
                    type="text"
                    value={row.value}
                    readOnly
                    onChange={(e) => updateRowValue(index, e.target.value)}
                    className="border p-1 rounded w-full bg-gray-100"
                />
            ),
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 px-2 pt-2 pb-0">
            {/* Inputs Grid */}
            <div className="bg-gray-50 shadow-md rounded p-2 h-50">
                <div className="rounded overflow-auto h-full">
                    <h3 className="font-bold pb-3">Inputs</h3>
                    <DataTable columns={columns} data={rows} />
                </div>
            </div>

            {/* Summary / Results Grid */}
            <div>
                <div className="bg-gray-50 shadow-md rounded p-3 h-50 overflow-auto">
                    <h3 className="font-bold pb-3">Summary</h3>
                    {/* Summary content will go here */}
                </div>
            </div>

            {/* API Request Data from 3rd Party App Grid */}
            <div>
                <div className="bg-white shadow-md rounded-lg p-5 h-full">
                    <h2 className="text-sm font-semibold mb-4">API Request Data from 3rd Party App</h2>
                    {/* 3rd party app data content will go here */}
                </div>
            </div>
        </div>
    );
}
