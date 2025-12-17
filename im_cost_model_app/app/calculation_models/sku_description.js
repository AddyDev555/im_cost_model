"use client";
import React, { useEffect, useState, useRef, useMemo } from "react";
import {IMCostModelMapper} from "../costingModels/models";

export default function SkuDescription({ allFormData }) {
    const [loading, setLoading] = useState(true);
    const didRun = useRef(false);

    useEffect(() => {
        if (didRun.current) return;
        didRun.current = true;
        setLoading(false);
    }, []);

    /* -------------------------------------------
       SKU LABEL → BACKEND LABEL MAPPING
       (same pattern as conversion/material cost)
    ------------------------------------------- */
    const SKU_LABEL_MAP = IMCostModelMapper.sku_description;

    /* -------------------------------------------
       Build display data from inputData
    ------------------------------------------- */
    const skuData = useMemo(() => {
        if (!allFormData?.inputData) return [];

        return allFormData.inputData
            .filter(row => SKU_LABEL_MAP[row.label])
            .map(row => ({
                key: row.label,
                label: SKU_LABEL_MAP[row.label],
                value: row.value ?? "",
            }));
    }, [allFormData]);

    return (
        <div className="w-full">
            <div className="overflow-auto print:overflow-visible">
                {loading ? (
                    <div className="flex flex-wrap gap-4">
                        {[0, 1, 2, 3, 4].map(i => (
                            <div key={i} className="flex flex-col">
                                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1" />
                                <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-x-4 gap-y-4">
                        {skuData.map(item => (
                            <div key={item.key} className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600">
                                    {item.label}
                                </label>
                                <input
                                    type="text"
                                    value={item.value}
                                    readOnly
                                    className="p-1 px-2 border rounded bg-gray-100 mt-1 text-sm w-48"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
