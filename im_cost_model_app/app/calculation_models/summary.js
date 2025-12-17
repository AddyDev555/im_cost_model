"use client";
import React, { useEffect, useState, useRef, useMemo } from "react";
import DataTable from '../../components/ui/data-table';
import { Treemap, Tooltip, ResponsiveContainer } from 'recharts';
import { IMCostModelMapper } from "../costingModels/models";

const GENERAL_SUMMARY_LABEL_MAP = IMCostModelMapper.general_summary;

const PROCESS_SUMMARY_LABEL_MAP = IMCostModelMapper.process_summary;

export default function Summary({ allFormData }) {
    const [loading, setLoading] = useState(true);
    const didRun = useRef(false);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DD0', '#FF69B4', '#7D3C98'];

    const CustomizedContent = (props) => {
        const { x, y, width, height, index, name, value } = props;

        if (width < 20 || height < 20) return null;

        return (
            <g>
                <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    style={{
                        fill: COLORS[index % COLORS.length],
                        stroke: '#fff',
                        strokeWidth: 2,
                    }}
                />
                <text
                    x={x + width / 2}
                    y={y + height / 2 - 7}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize={14}
                    fontWeight="bold"
                >
                    {name}
                </text>
                <text
                    x={x + width / 2}
                    y={y + height / 2 + 15}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize={20}
                >
                    {`${value.toFixed(0)}%`}
                </text>
            </g>
        );
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const name = data.name;
            const inrValue = data.inr_value || 0;

            return (
                <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
                    <p className="font-semibold text-gray-800 mb-1">{name}</p>
                    {inrValue > 0 && (
                        <>
                            <p className="text-sm text-gray-600">
                                {`Cost in INR: ₹${inrValue.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}`}
                            </p>
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
        setLoading(false);
    }, []);

    const { summaryData, summaryTableData } = useMemo(() => {
        if (!allFormData?.summaryData) {
            return { summaryData: [], summaryTableData: [] };
        }

        const order = ["material_cost", "conversion_cost", "margin", "packaging", "freight"];

        // Map labels to last occurrence
        const labelMap = {};
        allFormData.summaryData.forEach(item => {
            labelMap[item.label] = item;
        });

        const items = order.map(label => labelMap[label]).filter(Boolean);
        const totalItem = labelMap["total"];

        // Calculate total EUR (excluding total)
        const totalEur = items.reduce((sum, i) => {
            const val = parseFloat(i.value);
            return sum + (isNaN(val) ? 0 : val);
        }, 0);

        // TREEMAP data - use percent field if totalEur is 0 or invalid
        const summaryData = items
            .map(item => {
                const eur = parseFloat(item.value);
                const percent = parseFloat(item.percent);

                if (isNaN(eur) || eur <= 0) return null;

                // Use percent field if available and totalEur is invalid, otherwise calculate
                const percentValue = totalEur > 0
                    ? (eur / totalEur * 100)
                    : (!isNaN(percent) ? percent : 0);

                if (percentValue <= 0) return null;

                const inrItem = allFormData.summaryData.find(
                    d => d.label === item.label && d.currency === "INR"
                );
                const inrValue = inrItem ? parseFloat(inrItem.value) : 0;

                return {
                    name: GENERAL_SUMMARY_LABEL_MAP[item.label] || item.label,
                    value: +percentValue.toFixed(1),
                    eur_value: eur,
                    inr_value: inrValue
                };
            })
            .filter(Boolean);

        // TABLE data
        const summaryTableData = [
            ...items.map(item => {
                const eur = parseFloat(item.value);
                const percent = parseFloat(item.percent);

                const eurValue = isNaN(eur) ? 0 : eur;
                const percentValue = totalEur > 0
                    ? (eurValue / totalEur * 100)
                    : (!isNaN(percent) ? percent : 0);

                // Check if there's a corresponding INR value in summaryData
                const inrItem = allFormData.summaryData.find(
                    d => d.label === item.label && d.currency === "INR"
                );
                const inrValue = inrItem ? parseFloat(inrItem.value) : 0;

                return {
                    name: GENERAL_SUMMARY_LABEL_MAP[item.label] || item.label,
                    inr_value: `₹${(isNaN(inrValue) ? 0 : inrValue).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
                    eur_value: `€${eurValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
                    cost_ratio: `${percentValue.toFixed(1)}%`
                };
            }),
            totalItem ? (() => {
                const inrTotalItem = allFormData.summaryData.find(
                    d => d.label === "total" && d.currency === "INR"
                );
                const inrTotalValue = inrTotalItem ? parseFloat(inrTotalItem.value) : 0;

                return {
                    name: GENERAL_SUMMARY_LABEL_MAP[totalItem.label] || totalItem.label,
                    inr_value: `₹${(isNaN(inrTotalValue) ? 0 : inrTotalValue).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
                    eur_value: `€${(parseFloat(totalItem.value) || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
                    cost_ratio: `100.0%`
                };
            })() : null
        ].filter(Boolean);

        return { summaryData, summaryTableData };
    }, [allFormData]);


    const processTableData = useMemo(() => {
        if (!allFormData?.summaryData) return [];

        const order = ["feedstock", "injection", "assembly", "dispatch"];
        const labelMap = {};
        allFormData.summaryData.forEach(item => labelMap[item.label] = item);

        const items = order.map(label => labelMap[label]).filter(Boolean);
        const totalItem = labelMap["total"];

        // Calculate total from process items
        const totalValue = items.reduce((sum, i) => {
            const val = parseFloat(i.value);
            return sum + (isNaN(val) ? 0 : val);
        }, 0);

        return [
            ...items.map(item => {
                const eur = parseFloat(item.value);
                const percent = parseFloat(item.percent);

                const eurValue = isNaN(eur) ? 0 : eur;
                // Calculate percentage based on total or use provided percent
                const percentValue = totalValue > 0
                    ? (eurValue / totalValue * 100)
                    : (!isNaN(percent) ? percent : 0);

                // Check if there's a corresponding INR value in summaryData
                const inrItem = allFormData.summaryData.find(
                    d => d.label === item.label && d.currency === "INR"
                );
                const inrValue = inrItem ? parseFloat(inrItem.value) : 0;

                return {
                    name: PROCESS_SUMMARY_LABEL_MAP[item.label] || item.label,
                    inr_value: `₹${(isNaN(inrValue) ? 0 : inrValue).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
                    eur_value: `€${eurValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
                    per_value: `${percentValue.toFixed(1)}%`
                };
            }),
            totalItem ? (() => {
                const inrTotalItem = allFormData.summaryData.find(
                    d => d.label === "total" && d.currency === "INR"
                );
                const inrTotalValue = inrTotalItem ? parseFloat(inrTotalItem.value) : 0;

                return {
                    name: PROCESS_SUMMARY_LABEL_MAP[totalItem.label] || totalItem.label,
                    inr_value: `₹${(isNaN(inrTotalValue) ? 0 : inrTotalValue).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
                    eur_value: `€${(parseFloat(totalItem.value) || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
                    per_value: `100.0%`
                };
            })() : null
        ].filter(Boolean);
    }, [allFormData]);


    const summaryColumns = [
        {
            key: "name",
            title: "Details",
            render: (row) => (
                <div className={`text-sm text-gray-900 ${row.name === "Total" ? "font-bold" : "font-medium"}`}>
                    {row.name}
                </div>
            )
        },
        {
            key: "inr_value",
            title: "INR/T",
            render: (row) => (
                <div className={`text-sm text-gray-700 text-right ${row.name === "Total" ? "font-bold" : ""}`}>
                    {row.inr_value}
                </div>
            )
        },
        {
            key: "eur_value",
            title: "EUR/T",
            render: (row) => (
                <div className={`text-sm text-gray-700 text-right ${row.name === "Total" ? "font-bold" : ""}`}>
                    {row.eur_value}
                </div>
            )
        },
        {
            key: "cost_ratio",
            title: "%",
            render: (row) => (
                <div className={`text-sm text-gray-700 text-right ${row.name === "Total" ? "font-bold" : ""}`}>
                    {row.cost_ratio}
                </div>
            )
        },
    ];

    const processColumns = [
        {
            key: "name",
            title: "Details",
            render: (row) => (
                <div className={`text-sm text-gray-900 ${row.name === "Total" ? "font-bold" : "font-medium"}`}>
                    {row.name}
                </div>
            )
        },
        {
            key: "inr_value",
            title: "INR/T",
            render: (row) => (
                <div className={`text-sm text-gray-700 text-right ${row.name === "Total" ? "font-bold" : ""}`}>
                    {row.inr_value}
                </div>
            )
        },
        {
            key: "eur_value",
            title: "EUR/T",
            render: (row) => (
                <div className={`text-sm text-gray-700 text-right ${row.name === "Total" ? "font-bold" : ""}`}>
                    {row.eur_value}
                </div>
            )
        },
        {
            key: "per_value",
            title: "%",
            render: (row) => (
                <div className={`text-sm text-gray-700 text-right ${row.name === "Total" ? "font-bold" : ""}`}>
                    {row.per_value}
                </div>
            )
        },
    ];

    const processGraphData = useMemo(() => {
        return processTableData
            .filter(item => item.name !== "Total")
            .map(item => ({
                name: item.name,
                value: parseFloat(item.per_value) || 0,
                inr_value: parseFloat(String(item.inr_value).replace(/[^0-9.-]+/g, "")) || 0,
            }))
            .filter(item => item.value > 0);
    }, [processTableData]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 p-2 border rounded shadow-lg">
            {/* Summary Table */}
            <div className="lg:col-span-1 shadow-lg rounded p-2">
                <h3 className="font-bold mb-3">General Summary</h3>
                {loading ? (
                    <div className="space-y-2">
                        {[0, 1, 2, 3].map(i => (
                            <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <DataTable columns={summaryColumns} data={summaryTableData} />
                )}
            </div>

            {/* General Summary Chart */}
            <div className="lg:col-span-1">
                {loading ? (
                    <div className="h-64 bg-gray-200 rounded animate-pulse" />
                ) : (
                    summaryData.length > 0 ? (
                        <div className="w-full h-[320px]">
                            <ResponsiveContainer width="100%" height="100%" className="print:hidden">
                                <Treemap
                                    data={summaryData}
                                    dataKey="value"
                                    isAnimationActive={false}
                                    content={<CustomizedContent />}
                                >
                                    <Tooltip content={<CustomTooltip />} />
                                </Treemap>
                            </ResponsiveContainer>
                            <div className="hidden print:block">
                                <Treemap
                                    width={700}
                                    height={330}
                                    data={summaryData}
                                    dataKey="value"
                                    isAnimationActive={false}
                                    content={<CustomizedContent />}
                                />
                            </div>
                        </div>

                    ) : (
                        <div className="h-64 flex items-center justify-center text-gray-500">
                            No summary data to display
                        </div>
                    )
                )}
            </div>

            {/* Process Breakdown Table (Column 3) */}
            <div className="lg:col-span-1 shadow-lg rounded p-2">
                <h3 className="font-bold mb-3">Process Summary</h3>
                {loading ? (
                    <div className="space-y-2">
                        {[0, 1, 2, 3].map(i => (
                            <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <DataTable columns={processColumns} data={processTableData} />
                )}
            </div>

            {/* Processing Cost Graph (Column 4) */}
            <div className="lg:col-span-1">
                {loading ? (
                    <div className="h-64 bg-gray-200 rounded animate-pulse" />
                ) : (
                    processGraphData.length > 0 ? (
                        <div className="w-full h-[320px]">
                            <ResponsiveContainer width="100%" height="100%" className="print:hidden">
                                <Treemap
                                    data={processGraphData}
                                    dataKey="value"
                                    aspectRatio={4 / 3}
                                    fill="#8884d8"
                                    isAnimationActive={false}
                                    content={<CustomizedContent />}
                                >
                                    <Tooltip content={<CustomTooltip />} />
                                </Treemap>
                            </ResponsiveContainer>
                            <div className="hidden print:block">
                                <Treemap
                                    width={700}
                                    height={330}
                                    data={processGraphData}
                                    dataKey="value"
                                    isAnimationActive={false}
                                    content={<CustomizedContent />}
                                >
                                    <Tooltip content={<CustomTooltip />} />
                                </Treemap>
                            </div>
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-gray-500">
                            No processing data
                        </div>
                    )
                )}
            </div>
        </div>
    );
}