"use client";
import React, { useEffect, useState, useRef, useMemo } from "react";

export default function SkuDescription({allFormData, setAllFormData}) {
    const [loading, setLoading] = useState(true);
    const didRun = useRef(false);

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
        <div className="w-full">
            {/* SKU Data */}
            <div className="overflow-auto">
                {loading ? (
                    <div>
                        <div className="flex flex-wrap gap-4">
                            {[0, 1, 2, 3, 4].map(i => (
                                <div key={i} className="flex flex-col">
                                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1" />
                                    <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-x-4 gap-y-4">
                        {skuData.map((item) => (
                            <div key={item.key} className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600">{item.label}</label>
                                <input
                                    type="text"
                                    value={item.description || ""}
                                    readOnly
                                    className="p-1 border rounded bg-gray-100 mt-1 text-sm w-48"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
