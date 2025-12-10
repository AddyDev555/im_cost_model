"use client";
import React, { useEffect, useState, useRef, useMemo } from "react";
import DataTable from '../../components/ui/data-table';
import { Treemap, Tooltip, ResponsiveContainer } from 'recharts';

export default function SKUDescription({ allFormData, setAllFormData }) {
    const [loading, setLoading] = useState(true);
    const [hoveredItem, setHoveredItem] = useState(null);
    const didRun = useRef(false);

    const handleDataChange = (e, key) => {
        setAllFormData(prev => ({
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
                    value={allFormData[row.key] || ""}
                    readOnly
                    onChange={(e) => handleDataChange(e, row.key)}
                    className="w-full p-1 border rounded bg-gray-100" />
            )
        },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DD0', '#FF69B4', '#7D3C98'];

    const CustomizedContent = (props) => {
        const { x, y, width, height, index, name, value } = props;
        const isHovered = hoveredItem === name;
        const isFaded = hoveredItem !== null && !isHovered;

        if (width < 20 || height < 20) return null;

        return (
            <g
                onMouseEnter={() => setHoveredItem(name)}
                onMouseLeave={() => setHoveredItem(null)}
                style={{ opacity: isFaded ? 0.2 : 1, transition: 'opacity 0.2s ease-in-out' }}>
                <rect
                    x={x} y={y} width={width} height={height}
                    style={{ fill: COLORS[index % COLORS.length], stroke: '#fff', strokeWidth: 2 }} />
                <text x={x + width / 2} y={y + height / 2 + 18} textAnchor="middle" fill="#fff" fontSize={12} fontWeight="bold">{name}</text>
                <text x={x + width / 2} y={y + height / 2} textAnchor="middle" fill="#fff" fontSize={20}>{`${value.toFixed(2)}%`}</text>
            </g>
        );
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const value = data.value;
            const name = data.name;
            const conversionRates = { 'USD': { 'INR': 90.02, 'EUR': 0.8589 } };
            const baseCurrency = allFormData?.sku_currency?.toUpperCase() || 'USD';
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
        if (didRun.current) return;
        didRun.current = true;
        setLoading(false); // We rely on parent allFormData; initial cache is already loaded
    }, []);

    const { skuData, summaryData, summaryTableData } = useMemo(() => {
        if (!allFormData) return { skuData: [], summaryData: [], summaryTableData: [] };

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

        const summaryKeys = [
            'material_cost_per', 'conversion_cost_per', 'margin_cost_per',
            'packaging_cost_per', 'freight_cost_per'
        ];

        const skuData = skuRowsMap.map(r => ({ ...r, description: parseVal(allFormData[r.key]) }));

        const summaryData = summaryKeys
            .map(key => ({
                name: key.replace('_cost_per', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                value: parseFloat(allFormData[key]) || 0
            }))
            .filter(item => item.value > 0);

        const summaryTableData = summaryKeys.map(key => {
            const baseName = key.replace('_cost_per', '');
            const value = parseFloat(allFormData[key]) || 0;
            const inrValue = parseFloat(allFormData[`${baseName}_cost_inr`]) || 0;
            const eurValue = parseFloat(allFormData[`${baseName}_cost_eur`]) || 0;
            const costRatio = value.toFixed(2);

            return {
                name: key.replace('_cost_per', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                value,
                cost_ratio: `${costRatio}%`,
                inr_value: `₹${inrValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                eur_value: `€${eurValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            };
        }).filter(item => item.value > 0);

        if (allFormData.total_inr !== undefined && allFormData.total_eur !== undefined && allFormData.total_per !== undefined) {
            const totalInr = parseFloat(allFormData.total_inr) || 0;
            const totalEur = parseFloat(allFormData.total_eur) || 0;
            const totalPer = parseFloat(allFormData.total_per) || 0;

            summaryTableData.push({
                name: 'Total',
                value: totalPer,
                cost_ratio: `${totalPer.toFixed(2)}%`,
                inr_value: `₹${totalInr.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                eur_value: `€${totalEur.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            });
        }

        return { skuData, summaryData, summaryTableData };
    }, [allFormData]);

    const summaryColumns = [
        { key: "name", title: "Details", render: (row) => <div className={row.name === 'Total' ? 'font-bold' : ''}>{row.name}</div> },
        { key: "inr_value", title: "INR/T", render: (row) => <div className={row.name === 'Total' ? 'font-bold' : ''}>{row.inr_value}</div> },
        { key: "eur_value", title: "EUR/T", render: (row) => <div className={row.name === 'Total' ? 'font-bold' : ''}>{row.eur_value}</div> },
        { key: "cost_ratio", title: "%", render: (row) => <div className={`${row.name === 'Total' ? 'font-bold' : ''}`}>{row.cost_ratio}</div> },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full pt-2">
            {/* SKU Data */}
            <div className="overflow-auto border bg-gray-50 rounded shadow h-66.5 p-3 flex flex-col">
                <h3 className="pb-2 font-bold">SKU Descriptions</h3>
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

            {/* Summary Table */}
            <div className="overflow-auto border rounded bg-gray-50 shadow h-66.5 p-3 flex flex-col">
                {loading ? (
                    <div>
                        {[0, 1, 2, 3].map(i => (
                            <div key={i} className="grid grid-cols-12 gap-2 items-center py-1">
                                <div className="col-span-3 h-4 bg-gray-200 rounded animate-pulse" />
                                <div className="col-span-9 h-4 bg-gray-200 rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <DataTable columns={summaryColumns} data={summaryTableData} />
                )}
            </div>

            {/* Pie Chart */}
            <div className="overflow-hidden border rounded shadow h-66.5 flex flex-col">
                {loading ? (
                    <div className="w-full h-full bg-gray-200 rounded animate-pulse" />
                ) : (
                    summaryData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <Treemap
                                data={summaryData}
                                dataKey="value"
                                nameKey="name"
                                ratio={4 / 3}
                                isAnimationActive={false}
                                content={<CustomizedContent />}
                            >
                                <Tooltip content={<CustomTooltip />} />
                            </Treemap>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-sm text-gray-500">No summary data to display</div>
                    )
                )}
            </div>
        </div>
    );
}
