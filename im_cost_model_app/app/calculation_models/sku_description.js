"use client";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { IMCostModelMapper, CartonCostModel, CorrugateCostModel, RigidEBMCostModel, RigidISBM1CostModel, RigidISBM2CostModel } from "../costingModels/models";

function resolveSkuMapping(sheetName) {
    switch (sheetName) {
        case "im_cost_model":
            return IMCostModelMapper.sku_description;

        case "carton_cost_model":
            return CartonCostModel.sku_description;

        case "corrugate_cost_model":
            return CorrugateCostModel.sku_description;

        case "rigid_ebm_cost_model":
            return RigidEBMCostModel.sku_description;

        case "rigid_isbm1_cost_model":
            return RigidISBM1CostModel.sku_description;

        case "rigid_isbm2_cost_model":
            return RigidISBM2CostModel.sku_description;

        default:
            return {};
    }
}

export default function SkuDescription({ allFormData, setAllFormData, sheetName }) {
    const [loading, setLoading] = useState(true);
    const didRun = useRef(false);

    useEffect(() => {
        if (didRun.current) return;
        didRun.current = true;
        setLoading(false);
    }, []);

    const SKU_LABEL_MAP = useMemo(
        () => resolveSkuMapping(sheetName),
        [sheetName]
    );

    const skuData = useMemo(() => {
        if (!allFormData?.inputData) return [];

        return allFormData.inputData
            .filter(row => SKU_LABEL_MAP[row.label])
            .map(row => ({
                key: row.label,
                label: SKU_LABEL_MAP[row.label],
                value: row.value ?? "",
                dropdownValues: row.dropdownValues ?? [],
            }));
    }, [allFormData, SKU_LABEL_MAP]);

    const handleChange = (label, newValue) => {
        setAllFormData(prev => {
            if (!Array.isArray(prev?.inputData)) return prev;

            return {
                ...prev,
                inputData: prev.inputData.map(row =>
                    row.label === label
                        ? { ...row, value: newValue }
                        : row
                )
            };
        });
    };



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
                    <div className="flex flex-wrap gap-x-2 gap-y-4">
                        {skuData.map(item => (
                            <div key={item.key} className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600">
                                    {item.label}
                                </label>

                                {item.dropdownValues.length > 0 ? (
                                    <select
                                        value={item.value}
                                        className="p-1 px-2 border rounded bg-white mt-1 text-sm w-33"
                                        onChange={(e) => handleChange(item.key, e.target.value)}
                                    >
                                        <option value="">Select</option>
                                        {item.dropdownValues.map(opt => (
                                            <option key={opt} value={opt}>
                                                {opt}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        value={item.value}
                                        readOnly
                                        className="p-1 px-2 border rounded bg-gray-100 mt-1 text-sm w-33"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
