"use client";
import React, { useEffect, useState, useRef, useMemo } from "react";
import DataTable from '../../components/ui/data-table';

export default function SkuDescription({allFormData, setAllFormData}) {
    const [loading, setLoading] = useState(true);
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

    useEffect(() => {
        if (didRun.current) return;
        didRun.current = true;
        setLoading(false); // We rely on parent allFormData; initial cache is already loaded
    }, []);

    const { skuData } = useMemo(() => {
        if (!allFormData) return { skuData: [] };

        const parseVal = (v) => (v === null || v === undefined) ? '' : String(v);

        const skuRowsMap = [
            { label: 'SKU Description', key: 'sku_desc' },
            { label: 'SKU Code', key: 'sku_code' },
            { label: 'Country', key: 'sku_country' },
            { label: 'Currency', key: 'sku_currency' },
            { label: 'Supplier', key: 'sku_supplier' },
            // { label: 'Costing Period', key: 'costing_period' },
            // { label: 'Annual Volume', key: 'annual_volume' },
        ];

        const skuData = skuRowsMap.map(r => ({ ...r, description: parseVal(allFormData[r.key]) }));

        return { skuData };
    }, [allFormData]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 shadow-lg border gap-2 w-full p-2 rounded">
            {/* SKU Data */}
            <div className="overflow-auto border bg-gray-50 rounded h-66.5 p-3 flex flex-col">
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
        </div>
    );
}
