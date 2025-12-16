import React from 'react';

// Simple shadcn-style DataTable fallback component
export default function ConDataTable({ columns, data, hideHeader }) {
    return (
        <div className="w-full overflow-auto">
            <table className="w-full text-sm border-collapse">
                {!hideHeader && (
                    <thead>
                        <tr>
                            {columns.map((col, idx) => (
                                <th // Use a unique key for the header cells
                                    key={col.accessorKey || `header-${idx}`}
                                    className={`text-left p-2 bg-violet-100 text-xs text-gray-500 pb-2 border-b 
                                        ${idx === 0 ? "pr-2" : ""}`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                )}
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr readOnly key={row.id || `row-${rowIndex}`} className="odd:bg-white even:bg-gray-50">
                            {columns.map((col, colIndex) => (
                                <td // Combine row and column keys for a unique cell key
                                    key={`${row.id || `row-${rowIndex}`}-${col.accessorKey || `col-${colIndex}`}`}
                                    className={`p-2 text-gray-700 
                                        ${colIndex === 0 ? "pr-6" : ""}`}
                                >
                                    {col.cell ? col.cell({ row: { original: row, index: rowIndex } }) : row[col.accessorKey]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
