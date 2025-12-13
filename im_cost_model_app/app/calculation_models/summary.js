"use client";
import React, { useEffect, useState, useRef, useMemo } from "react";
import DataTable from '../../components/ui/data-table';
import { Treemap, Tooltip, ResponsiveContainer } from 'recharts';

export default function Summary({ allFormData, setAllFormData }) {
    const [loading, setLoading] = useState(true);
    const [hoveredItem, setHoveredItem] = useState(null);
    const didRun = useRef(false);

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
                <text x={x + width / 2} y={y + height / 2} textAnchor="middle" fill="#fff" fontSize={15}>{`${value.toFixed(0)}%`}</text>
            </g>
        );
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const name = data.name;
            const inrValue = data.inr_value || 0;
            // const eurValue = data.eur_value || 0;

            return (
                <div className="bg-white p-2 border border-gray-300 rounded shadow-lg">
                    <p className="font-bold">{name}</p>
                    {inrValue > 0 && (
                        <>
                            <p>{`Cost in INR: ₹${inrValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</p>
                            {/* <p>{`Cost in EUR: €${eurValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</p> */}
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

    const { summaryData, summaryTableData } = useMemo(() => {
        if (!allFormData) return { summaryData: [], summaryTableData: [] };

        const summaryKeys = [
            'material_cost_per', 'conversion_cost_per', 'margin_cost_per',
            'packaging_cost_per', 'freight_cost_per'
        ];

        const summaryData = summaryKeys
            .map(key => {
                const baseName = key.replace('_cost_per', '');
                return {
                    name: baseName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                    value: parseFloat(allFormData[key]) || 0,
                    inr_value: parseFloat(
                        // Handle special case for material cost which doesn't have '_inr' suffix
                        baseName === 'material' ? allFormData['material_cost'] : allFormData[`${baseName}_cost_inr`]
                    ) || 0,
                    eur_value: parseFloat(allFormData[`${baseName}_cost_eur`]) || 0,
                };
            })
            .filter(item => item.value > 0);

        const summaryTableData = summaryKeys.map(key => {
            const baseName = key.replace('_cost_per', '');
            const value = parseFloat(allFormData[key]) || 0;
            const inrValue = parseFloat(
                // Handle special case for material cost which doesn't have '_inr' suffix
                baseName === 'material' ? allFormData['material_cost'] : allFormData[`${baseName}_cost_inr`]
            ) || 0;
            const eurValue = parseFloat(allFormData[`${baseName}_cost_eur`]) || 0;
            const costRatio = value.toFixed(0);

            return {
                name: key.replace('_cost_per', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                value,
                cost_ratio: `${costRatio}%`,
                inr_value: `₹${inrValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
                eur_value: `€${eurValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
            };
        }).filter(item => item.value > 0);

        if (allFormData.total_inr !== undefined && allFormData.total_eur !== undefined && allFormData.total_per !== undefined) {
            const totalInr = parseFloat(allFormData.total_inr) || 0;
            const totalEur = parseFloat(allFormData.total_eur) || 0;
            const totalPer = parseFloat(allFormData.total_per) || 0;

            summaryTableData.push({
                name: 'Total',
                value: totalPer,
                cost_ratio: `${totalPer.toFixed(0)}%`,
                inr_value: `₹${totalInr.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
                eur_value: `€${totalEur.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
            });
        }

        return { summaryData, summaryTableData };
    }, [allFormData]);

    const summaryColumns = [
        { key: "name", title: "Details", render: (row) => <div className={row.name === 'Total' ? 'font-bold' : ''}>{row.name}</div> },
        { key: "inr_value", title: "INR/T", render: (row) => <div className={row.name === 'Total' ? 'font-bold' : ''}>{row.inr_value}</div> },
        { key: "eur_value", title: "EUR/T", render: (row) => <div className={row.name === 'Total' ? 'font-bold' : ''}>{row.eur_value}</div> },
        { key: "cost_ratio", title: "%", render: (row) => <div className={`${row.name === 'Total' ? 'font-bold' : ''}`}>{row.cost_ratio}</div> },
    ];

    const processDataTable = useMemo(() => {
        if (!allFormData) return [];

        const rows = [
            { label: "Feedstock", key: "feedstock" },
            { label: "Injection", key: "injection" },
            { label: "Dispatch", key: "dispatch" },
            { label: "Assembly", key: "assembly" },
            { label: "Total", key: "total" }
        ];

        return rows.map(r => {
            const inr = parseFloat(allFormData[`${r.key}_inr`]) || 0;
            const eur = parseFloat(allFormData[`${r.key}_eur`]) || 0;
            const per = parseFloat(allFormData[`${r.key}_per`]) || 0;

            return {
                name: r.label,
                inr_value: `₹${inr.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
                eur_value: `€${eur.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
                per_value: `${per.toFixed(0)}%`
            };
        });
    }, [allFormData]);

    const processColumns = [
        { key: "name", title: "Details", render: (row) => <div className={row.name === 'Total' ? 'font-bold' : ''}>{row.name}</div>},
        { key: "inr_value", title: "INR/T", render: (row) => <div className={row.name === 'Total' ? 'font-bold' : ''}>{row.inr_value}</div>  },
        { key: "eur_value", title: "EUR/T", render: (row) => <div className={row.name === 'Total' ? 'font-bold' : ''}>{row.eur_value}</div>  },
        { key: "per_value", title: "%", render: (row) => <div className={row.name === 'Total' ? 'font-bold' : ''}>{row.per_value}</div>  },
    ];

    const processGraphData = useMemo(() => {
        return processDataTable
            .filter(item => item.name !== "Total") // Optional: skip Total in graph
            .map(item => ({
                name: item.name,
                value: parseFloat(item.per_value) || 0,
                inr_value: parseFloat(String(item.inr_value).replace(/[^0-9.-]+/g,"")) || 0,
                eur_value: parseFloat(String(item.eur_value).replace(/[^0-9.-]+/g,"")) || 0,
            }))
            .filter(item => item.value > 0);
    }, [processDataTable]);



    return (
        <div className="grid grid-cols-1 border shadow-lg md:grid-cols-4 gap-2 w-full p-2">
            {/* Summary Table */}
            <div className="overflow-auto border rounded bg-gray-50 shadow h-72.5 px-3 py-2 flex flex-col">
                <h3 className="font-bold pb-3">General Summary</h3>
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
            <div className="overflow-hidden border rounded shadow h-72.5 flex flex-col">
                {loading ? (
                    <div className="w-full h-full bg-gray-200 rounded animate-pulse" />
                ) : (
                    summaryData.length > 0 ? (
                        <>
                            {/* Chart for Screen View (Responsive) */}
                            <div className="w-full h-full print:hidden">
                                <ResponsiveContainer width="100%" height="100%">
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
                            </div>
                            {/* Chart for Print View (Fixed Size) */}
                            <div className="hidden print:block">
                                <Treemap                                 
                                    width={700}
                                    height={280}
                                    data={summaryData}
                                    dataKey="value"
                                    nameKey="name"
                                    ratio={4 / 3}
                                    isAnimationActive={false}
                                    content={<CustomizedContent />}
                                >
                                    <Tooltip content={<CustomTooltip />} />
                                </Treemap>
                            </div>
                        </>
                    ) : (
                        <div className="text-sm text-gray-500">No summary data to display</div>
                    )
                )}
            </div>

            {/* Process Breakdown Table (Column 3) */}
            <div className="overflow-auto border rounded bg-gray-50 shadow h-72.5 p-3 flex flex-col">
                <h3 className="font-bold pb-3">Process Summary</h3>
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
                    <DataTable columns={processColumns} data={processDataTable} />
                )}
            </div>

            {/* Processing Cost Graph (Column 4) */}
            <div className="overflow-hidden border rounded shadow h-72.5 flex flex-col">
                {loading ? (
                    <div className="w-full h-full bg-gray-200 rounded animate-pulse" />
                ) : (
                    processGraphData.length > 0 ? (
                        <>
                            {/* Chart for Screen View (Responsive) */}
                            <div className="w-full h-full print:hidden">
                                <ResponsiveContainer width="100%" height="100%">
                                    <Treemap
                                        data={processGraphData}
                                        dataKey="value"
                                        nameKey="name"
                                        ratio={4 / 3}
                                        isAnimationActive={false}
                                        content={<CustomizedContent />}
                                    >
                                        <Tooltip content={<CustomTooltip />} />
                                    </Treemap>
                                </ResponsiveContainer>
                            </div>
                            {/* Chart for Print View (Fixed Size) */}
                            <div className="hidden print:block">
                                <Treemap                                  
                                    width={700}
                                    height={280}
                                    data={processGraphData}
                                    dataKey="value"
                                    nameKey="name"
                                    ratio={4 / 3}
                                    isAnimationActive={false}
                                    content={<CustomizedContent />}
                                >
                                    <Tooltip content={<CustomTooltip />} />
                                </Treemap>
                            </div>
                        </>
                    ) : (
                        <div className="text-sm text-gray-500">No processing data</div>
                    )
                )}
            </div>
        </div>
    );
}
