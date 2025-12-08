import React from 'react';

// Simple shadcn-style DataTable fallback component
export default function DataTable({ columns, data, hideHeader }) {
    return (
        <div className="w-full overflow-auto">
            <table className="w-full text-sm border-collapse">
                {!hideHeader && (
                    <thead>
                        <tr>
                            {columns.map((col, idx) => (
                                <th
                                    key={col.key}
                                    className={`text-left text-xs text-gray-500 pb-2 border-b 
                                        ${idx === 0 ? "pr-2" : ""}`}
                                >
                                    {col.title}
                                </th>
                            ))}
                        </tr>
                    </thead>
                )}
                <tbody>
                    {data.map((row, idx) => (
                        <tr key={idx} className="odd:bg-white even:bg-gray-50">
                            {columns.map((col, colIndex) => (
                                <td
                                    key={col.key}
                                    className={`py-2 text-gray-700 
                                        ${colIndex === 0 ? "pr-6" : ""}`}
                                >
                                    {col.render ? col.render(row) : row[col.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
