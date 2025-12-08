"use client";
import React, { useEffect, useState, useRef, useMemo } from "react";
import DataTable from '../../components/ui/data-table';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function SKUDescription() {
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const didRun = useRef(false);

    const handleDataChange = (e, key) => {
        setFormData(prev => ({
            ...prev,
            [key]: e.target.value
        }));
    };

    const infoColumns = [
        { key: "label", title: "Basic Info" },
        {
            key: "description", title: "Description",
            render: (row) => (
                <input
                    type="text"
                    value={row.description}
                    onChange={(e) => handleDataChange(e, row.key)}
                    className="w-full p-1 border rounded" />
            )
        },
    ];

    const machineInfoColumns = [
        { key: "label", title: "Mould Info" },
        {
            key: "description", title: "Description",
            render: (row) => (
                <input
                    type="text"
                    value={row.description}
                    onChange={(e) => handleDataChange(e, row.key)}
                    className="w-full p-1 border rounded" />
            )
        },
    ];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const value = data.value;
            const name = data.name;
            const conversionRates = { 'USD': { 'INR': 90.02, 'EUR': 0.8589 } }; // This could be dynamic
            const baseCurrency = formData?.sku_currency?.toUpperCase() || 'USD';
            const rates = conversionRates[baseCurrency];

            let inrValue, eurValue;
            if (rates) {
                inrValue = value * rates['INR'];
                eurValue = value * rates['EUR'];
            }

            return (
                <div className="bg-white p-2 border border-gray-300 rounded shadow-lg">
                    <p className="font-bold">{name}</p>
                    <p>{`Cost: ${value.toLocaleString()} ${baseCurrency}`}</p>
                    {rates && (
                        <>
                            <p>{`Cost in INR: ₹${inrValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</p>
                            <p>{`Cost in EUR: €${eurValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</p>
                        </>
                    )}
                </div>
            );
        }
        return null;
    };

    useEffect(() => {
        if (didRun.current) return; // prevent second call
        didRun.current = true;
        const fetchData = async () => {
            setLoading(true);
            try {
                const skuRes = await fetch('http://127.0.0.1:8000/api/sku/get-sku-inputs');
                if (!skuRes.ok) throw new Error(`SKU fetch failed: HTTP ${skuRes.status}`);
                const skuResult = await skuRes.json();
                setFormData(skuResult.data || {});
            } catch (err) {
                console.error('Failed to fetch data:', err);
                setFormData({}); // Set to empty object on error to avoid render issues
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const { skuData, machineData, summaryData } = useMemo(() => {
        if (!formData) return { skuData: [], machineData: [], summaryData: [] };

        const parseVal = (v) => (v === null || v === undefined) ? '' : String(v);

        const skuRowsMap = [
            { label: 'SKU Description', key: 'sku_desc' },
            { label: 'SKU Code', key: 'sku_code' },
            { label: 'Country', key: 'sku_country' },
            { label: 'Currency', key: 'sku_currency' },
            { label: 'Supplier', key: 'sku_supplier' },
            { label: 'Costing Period', key: 'costing_period' },
            { label: 'Annual Volume', key: 'annual_volume' },
        ];

        const machineRowsMap = [
            { label: 'Mould Cavitation', key: 'mould_cavitation' },
            { label: 'Mould Cycle Time', key: 'mould_cycle_time' },
            { label: 'Machine Model Tonnage', key: 'machine_model_tonnage' },
            { label: 'Setups Per Year', key: 'no_of_setups_per_year' },
            { label: 'Ramp-ups Per Year', key: 'no_of_ramp_ups_per_year' },
        ];

        const summaryKeys = [
            'conversion_cost_per', 'freight_cost_per', 'margin_cost_per',
            'material_cost_per', 'packaging_cost_per'
        ];

        const skuData = skuRowsMap.map(r => ({ ...r, description: parseVal(formData[r.key]) }));
        const machineData = machineRowsMap.map(r => ({ ...r, description: parseVal(formData[r.key]) }));

        const summaryData = summaryKeys
            .map(key => ({
                name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                value: parseFloat(formData[key]) || 0
            }))
            .filter(item => item.value > 0);

        return { skuData, machineData, summaryData };
    }, [formData]);

    const updateAllInputs = async () => {
        try {
            setLoading(true);

            const res = await fetch("http://127.0.0.1:8000/api/sku/update-sku-inputs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error(`Update failed: HTTP ${res.status}`);

            const updated = await res.json();

            if (updated.success) {
                setFormData(updated.data);
            } else {
                throw new Error(updated.message || "An unknown error occurred during update.");
            }

        } catch (error) {
            console.error("Update failed:", error);
            // Optionally, show an error to the user
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full pt-2">
            {/* SKU Data */}
            <div className="overflow-auto border rounded shadow h-50 p-3 flex flex-col">
                {loading ? (
                    <div>
                        {[0, 1, 2, 3, 4].map(i => (
                            <div key={i} className="grid grid-cols-12 gap-2 items-center py-1">
                                <div className="col-span-5 h-4 bg-gray-200 rounded animate-pulse" />
                                <div className="col-span-7 h-4 bg-gray-200 rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <DataTable columns={infoColumns} data={skuData} />
                )}
            </div>

            {/* Machine Data */}
            <div className="overflow-auto border rounded shadow h-50 p-3 flex flex-col">
                {loading ? (
                    <div>
                        {[0, 1, 2, 3].map(i => (
                            <div key={i} className="grid grid-cols-12 gap-2 items-center py-1">
                                <div className="col-span-5 h-4 bg-gray-200 rounded animate-pulse" />
                                <div className="col-span-7 h-4 bg-gray-200 rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <DataTable columns={machineInfoColumns} data={machineData} />
                )}
                {!loading && (
                    <button
                        onClick={updateAllInputs}
                        className="mt-4 px-4 py-2 bg-violet-500 text-white cursor-pointer rounded hover:bg-violet-600 disabled:bg-gray-400"
                    >
                        Update
                    </button>
                )}
            </div>

            {/* Pie Chart */}
            <div className="overflow-hidden border rounded shadow h-50 p-3 flex flex-col">
                <h3 className="text-sm font-semibold">Cost Breakdown</h3>
                {loading ? (
                    <div className="flex items-center justify-center w-full h-full">
                        <div className="w-24 h-24 bg-gray-200 rounded-full animate-pulse" />
                    </div>
                ) : (
                    summaryData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250} className="relative bottom-12">
                            <PieChart>
                                <Pie
                                    data={summaryData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    innerRadius={40}
                                    fill="#8884d8"
                                    labelLine={false}
                                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                >
                                    {summaryData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DD0'][index % 5]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-sm text-gray-500">No summary data to display</div>
                    )
                )}
            </div>
        </div>
    );
}