import React from 'react';

// Simple shadcn-style DataTable fallback component
export default function DataTable({ columns, data, hideHeader = false }) {
    return (
        <div className="w-full overflow-auto">
            <table className="w-full text-sm border-collapse h-full">
                {!hideHeader && (
                    <thead>
                        <tr>
                            {columns.map((col, idx) => (
                                <th
                                    key={col.key || idx}
                                    className={`text-left bg-violet-100 p-2 text-xs text-gray-500 pb-2 border-b 
                                        ${idx === 0 ? "pr-2" : ""}`}
                                >
                                    {col.title}
                                </th>
                            ))}
                        </tr>
                    </thead>
                )}

                <tbody>
                    {data.map((row, rowIdx) => (
                        <tr key={row.id || rowIdx} className="odd:bg-white even:bg-gray-50">
                            {columns.map((col, colIndex) => {
                                const value = row[col.key];

                                return (
                                    <td
                                        key={col.key || colIndex}
                                        className={`p-2 text-gray-700 
                                            ${colIndex === 0 ? "pr-6" : ""}
                                            ${col.align === "right" ? "text-right" : ""}
                                            ${col.align === "center" ? "text-center" : ""}`}
                                    >
                                        {/* Custom render has highest priority */}
                                        {col.render
                                            ? col.render(row)
                                            : value !== undefined && value !== null
                                                ? value
                                                : ""}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}