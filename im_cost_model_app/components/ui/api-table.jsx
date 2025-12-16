import React from "react";

export default function DataTable({ data }) {
    if (!data || data.length === 0) {
        return <div className="w-full">
            {[0, 1, 2, 3].map((i) => (
                <div
                    key={i}
                    className="grid grid-cols-12 gap-4 items-center py-2"
                >
                    <div className="col-span-6 h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="col-span-2 h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="col-span-2 h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="col-span-2 h-4 bg-gray-200 rounded animate-pulse" />
                </div>
            ))}
        </div>

    }

    // Only show these specific keys
    const visibleKeys = ["Grade", "Date", "Price", "Company", "State"];

    return (
        <div className="w-full overflow-auto h-42">
            <table className="w-full text-sm border-collapse">
                <thead>
                    <tr>
                        {visibleKeys.map((key, idx) => (
                            <th
                                key={`header-${key}`}
                                className={`text-left bg-violet-100 p-2 text-xs text-gray-500 pb-2 border-b 
                                    ${idx === 0 ? "" : ""}`}
                            >
                                {key}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={`row-${rowIndex}`} className="odd:bg-white even:bg-gray-50">
                            {visibleKeys.map((key, colIndex) => (
                                <td
                                    key={`cell-${rowIndex}-${key}`}
                                    className={`py-2 px-2 text-gray-700 
                                        ${colIndex === 0 ? "pr-6" : ""}`}
                                >
                                    {row[key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
