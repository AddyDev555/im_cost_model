'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Minus } from 'lucide-react';
import DataTable from '../../components/ui/data-table';
import ApiDataTable from '../../components/ui/api-table';
import { api } from "@/utils/api";

export default function MaterialCalculator({ allFormData, setAllFormData, loadingSummary}) {
    const [showShot2, setShowShot2] = useState(false);
    const [ppRate, setPpRate] = useState([]);
    const [ppColumns, setPpColumns] = useState([]);

    useEffect(() => {
        async function fetchPPData() {
            try {
                const json = await api.get("/api/material/pp-rate");
                const rows = json.data || [];
                if (rows.length > 0) {
                    const cols = Object.keys(rows[0]).map((key) => ({
                        accessorKey: key,
                        header: key,
                    }));
                    setPpColumns(cols);
                }
                setPpRate(rows);
            } catch (err) {
                console.error("Failed to fetch PP data:", err);
            }
        }
        fetchPPData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const parsed = value === '' ? '' : parseFloat(String(value).replace(/,/g, ''));
        const numValue = parsed === '' || Number.isNaN(parsed) ? '' : parsed;

        setAllFormData(prev => ({ ...prev, [name]: numValue }));
    };

    return (
        <div className="w-full px-1">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <form onSubmit={(e) => handleSubmit(e)} className="overflow-x-auto">
                    {/* Weight row with buttons */}
                    <div className="px-4 sm:px-6 py-3 border-b">
                        <div className="grid grid-cols-14 items-center">
                            <div className="col-span-3 sm:col-span-1 text-sm text-gray-800">Weight (g)</div>
                            <div className="col-span-4 sm:col-span-7">
                                <input
                                    type="number"
                                    name="weight_g"
                                    value={allFormData.weight_g}
                                    onChange={handleInputChange}
                                    readOnly
                                    className="w-14 px-2 bg-gray-100 py-0.5 text-sm border border-gray-300 rounded"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Shot 1 & Shot 2 Side-by-side layout - responsive width */}
                    <div className={`grid gap-0 ${showShot2 ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
                        {/* Shot 1 */}
                        <div className={`pb-2 sm:px-2 py-0 border-b ${showShot2 ? 'lg:border-r' : ''}`}>
                            <div className="flex items-center justify-between mb-3">
                                {/* <h3 className="text-md font-semibold">Shot 1</h3> */}
                                {/* {!showShot2 && (
                                    <button
                                        type="button"
                                        onClick={() => setShowShot2(true)}
                                        title="Add Shot 2"
                                        className="p-1 cursor-pointer rounded hover:bg-gray-100"
                                    >
                                        <Plus size={18} />
                                    </button>
                                )} */}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                                {/* Column 1: Inputs rendered as a DataTable with input boxes */}
                                <div className="bg-gray-50 border rounded p-3 overflow-auto print:overflow-visible print:h-auto">
                                    <h3 className='font-bold pb-3'>Inputs</h3>
                                    {(() => {
                                        const columnsInputs = [
                                            { key: 'label', title: 'Material' },
                                            {
                                                key: 'ratio', title: 'Ratio', render: (row) => (
                                                    <input
                                                        type="number"
                                                        name={row.ratioName}
                                                        value={allFormData[row.ratioName] || ''}
                                                        readOnly
                                                        onChange={handleInputChange}
                                                        className="w-full px-2 py-0.5 text-sm border border-gray-300 bg-gray-100"
                                                    />
                                                )
                                            },
                                            {
                                                key: 'rate', title: 'Rate (INR/kg)', render: (row) => (
                                                    <input
                                                        type="number"
                                                        name={row.rateName}
                                                        value={allFormData[row.rateName] || ''}
                                                        readOnly
                                                        onChange={handleInputChange}
                                                        className="w-full px-2 py-0.5 text-sm border border-gray-300 bg-gray-100"
                                                    />
                                                )
                                            },
                                            {
                                                key: 'applicable', title: 'Rate (INR/kg)', render: (row) => (
                                                    <input
                                                        type="number"
                                                        name={row.applicableName}
                                                        value={allFormData[row.applicableName] || ''}
                                                        onChange={handleInputChange}
                                                        className="w-full px-2 py-0.5 text-sm border border-gray-300"
                                                    />                                                )
                                            },
                                        ];

                                        const inputRows = [];

                                        // Shot 1 rows
                                        inputRows.push({ label: 'Polymer', ratioName: 'shot1_ratio_pct', rateName: 'shot1_poly_rate', applicableName: 'shot1_applicable_rate' });
                                        inputRows.push({ label: 'Masterbatch', ratioName: 'shot1_mb_dosage_pct', rateName: 'shot1_mb_rate', applicableName: 'shot1_mb_applicable_rate' });
                                        inputRows.push({ label: 'Additive', ratioName: 'shot1_add_dosage_pct', rateName: 'shot1_add_rate', applicableName: 'shot1_add_applicable_rate' });

                                        // Shot 2 rows if visible
                                        if (showShot2) {
                                            inputRows.push({ label: 'Polymer', ratioName: 'shot2_ratio_pct', rateName: 'shot2_poly_rate', applicableName: 'shot2_applicable_rate' });
                                            inputRows.push({ label: 'Masterbatch', ratioName: 'shot2_mb_dosage_pct', rateName: 'shot2_mb_rate', applicableName: 'shot2_mb_applicable_rate' });
                                            inputRows.push({ label: 'Additive', ratioName: 'shot2_add_dosage_pct', rateName: 'shot2_add_rate', applicableName: 'shot2_add_applicable_rate' });
                                            inputRows.push({ label: 'Regrind', ratioName: 'regrind_ratio_pct', rateName: 'regrind_rate', applicableName: 'regrind_applicable_rate' });
                                        }

                                        // if (loadingInputs) {
                                        //     return (
                                        //         <div>
                                        //             {inputRows.map((r, idx) => (
                                        //                 <div key={idx} className="grid grid-cols-12 gap-2 items-center py-2">
                                        //                     <div className="col-span-4 h-4 bg-gray-200 rounded animate-pulse" />
                                        //                     <div className="col-span-3 h-4 bg-gray-200 rounded animate-pulse" />
                                        //                     <div className="col-span-3 h-4 bg-gray-200 rounded animate-pulse" />
                                        //                     <div className="col-span-2 h-4 bg-gray-200 rounded animate-pulse" />
                                        //                 </div>
                                        //             ))}
                                        //         </div>
                                        //     );
                                        // }

                                        return <DataTable columns={columnsInputs} data={inputRows} />;
                                    })()}
                                </div>

                                {/* Column 2: Results / Summary using DataTable */}
                                <div>
                                    <div className="bg-gray-50 border rounded p-3 overflow-auto print:overflow-visible print:h-auto">
                                        <h3 className='font-bold pb-3'>Summary</h3>
                                        {(() => {
                                            const columns = [
                                                {
                                                    key: "label",
                                                    title: "Material",
                                                    render: (row) => <div className={row.label === 'Total' ? 'font-bold' : ''}>{row.label}</div>
                                                },
                                                {
                                                    key: "inr",
                                                    title: "INR/T",
                                                    render: (row) => <div className={row.label === 'Total' ? 'font-bold' : ''}>{row.inr}</div>
                                                },
                                                {
                                                    key: "eur",
                                                    title: "EUR/T",
                                                    render: (row) => <div className={row.label === 'Total' ? 'font-bold' : ''}>{row.eur}</div>
                                                },
                                                {
                                                    key: "pct",
                                                    title: "%",
                                                    render: (row) => <div className={row.label === 'Total' ? 'font-bold' : ''}>{row.pct}</div>
                                                },
                                            ];

                                            const rows = [
                                                {
                                                    label: "Resin",
                                                    inr: `₹${Number(allFormData.resin_cost || 0).toFixed(1)}`,
                                                    eur: `€${Number(allFormData.resin_cost_eur || 0).toFixed(1)}`,
                                                    pct: `${Number(allFormData.resin_cost_per || 0).toFixed(1)}%`,
                                                },
                                                {
                                                    label: "Masterbatch",
                                                    inr: `₹${Number(allFormData.mb_cost || 0).toFixed(1)}`,
                                                    eur: `€${Number(allFormData.mb_cost_eur || 0).toFixed(1)}`,
                                                    pct: `${Number(allFormData.mb_cost_per || 0).toFixed(1)}%`,
                                                },
                                                {
                                                    label: "Additive",
                                                    inr: `₹${Number(allFormData.add_cost || 0).toFixed(1)}`,
                                                    eur: `€${Number(allFormData.add_cost_eur || 0).toFixed(1)}`,
                                                    pct: `${Number(allFormData.add_cost_per || 0).toFixed(1)}%`,
                                                },
                                                {
                                                    label: "Total",
                                                    inr: `₹${Number(allFormData.material_cost || 0).toFixed(1)}`,
                                                    eur: `€${Number(allFormData.material_cost_eur || 0).toFixed(1)}`,
                                                    pct: `${Number(allFormData.material_cost_per || 100).toFixed(1)}%`,
                                                },
                                            ];

                                            if (loadingSummary) {
                                                return (
                                                    <div>
                                                        {[0, 1, 2, 3].map((i) => (
                                                            <div key={i} className="grid grid-cols-12 gap-2 items-center py-2">
                                                                <div className="col-span-6 h-4 bg-gray-200 rounded animate-pulse" />
                                                                <div className="col-span-2 h-4 bg-gray-200 rounded animate-pulse" />
                                                                <div className="col-span-2 h-4 bg-gray-200 rounded animate-pulse" />
                                                                <div className="col-span-2 h-4 bg-gray-200 rounded animate-pulse" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                );
                                            }

                                            return <DataTable columns={columns} data={rows} />;
                                        })()}
                                    </div>
                                </div>


                                {/* Column 3: Empty placeholder for future content */}
                                <div>
                                    <div className="bg-gray-50 border rounded p-3 h-full items-center justify-center text-sm text-gray-400 overflow-auto print:overflow-visible print:h-auto">
                                        {/* Placeholder - empty for now */}
                                        <h3 className='font-bold pb-3 text-black'>Polymer Prices</h3>
                                        <ApiDataTable data={ppRate} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shot 2 */}
                        {showShot2 && (
                            <div className="px-4 sm:px-6 py-2 border-b">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-md font-semibold">Shot 2</h3>
                                    <button
                                        type="button"
                                        onClick={() => setShowShot2(false)}
                                        title="Remove Shot 2"
                                        className="p-1 rounded cursor-pointer hover:bg-gray-100"
                                    >
                                        <Minus size={18} />
                                    </button>
                                </div>

                                {/* Table header (hidden on xs) */}
                                <div className="hidden sm:grid grid-cols-12 gap-2 text-xs text-gray-500 mb-1">
                                    <div className="col-span-2">Material</div>
                                    <div className="col-span-2">Ratio (%)</div>
                                    <div className="col-span-2">Rate (INR/kg)</div>
                                    <div className="col-span-3">Applicable Rate (INR/Kg)</div>
                                    <div className="col-span-3"></div>
                                </div>
                                {/* Polymer / Resin row */}
                                <div className="grid grid-cols-12 gap-2 items-center py-1">
                                    <div className="col-span-2 text-sm text-gray-700">Polymer</div>
                                    <div className="col-span-2">
                                        <input type="number" name="shot2_ratio_pct" value={formData.shot2_ratio_pct === 0 ? '' : formData.shot2_ratio_pct} onChange={handleInputChange} className="w-24 px-2 py-1 text-sm border border-gray-300 rounded-md" />
                                    </div>
                                    <div className="col-span-2">
                                        <input type="number" name="shot2_poly_rate" value={formData.shot2_poly_rate === 0 ? '' : formData.shot2_poly_rate} onChange={handleInputChange} readOnly className="w-24 px-2 py-1 text-sm border border-gray-300 rounded-md bg-gray-100" />
                                    </div>
                                    <div className="col-span-3">
                                        <input type="number" name="shot2_applicable_rate" value={formData.shot2_applicable_rate === 0 ? '' : formData.shot2_applicable_rate} onChange={handleInputChange} className="w-24 px-2 py-1 text-sm border border-gray-300 rounded-md" />
                                    </div>
                                    <div className="col-span-3"></div>
                                </div>

                                {/* Masterbatch row */}
                                <div className="grid grid-cols-12 gap-2 items-center py-1">
                                    <div className="col-span-2 text-sm text-gray-700">Masterbatch</div>
                                    <div className="col-span-2">
                                        <input type="number" name="shot2_mb_dosage_pct" value={formData.shot2_mb_dosage_pct === 0 ? '' : formData.shot2_mb_dosage_pct} onChange={handleInputChange} className="w-24 px-2 py-1 text-sm border border-gray-300 rounded-md" />
                                    </div>
                                    <div className="col-span-2">
                                        <input type="number" name="shot2_mb_rate" value={formData.shot2_mb_rate === 0 ? '' : formData.shot2_mb_rate} onChange={handleInputChange} readOnly className="w-24 px-2 py-1 text-sm border border-gray-300 rounded-md bg-gray-100" />
                                    </div>
                                    <div className="col-span-3">
                                        <input type="number" name="shot2_mb_applicable_rate" value={formData.shot2_mb_applicable_rate === 0 ? '' : formData.shot2_mb_applicable_rate} onChange={handleInputChange} className="w-24 px-2 py-1 text-sm border border-gray-300 rounded-md" />
                                    </div>
                                    <div className="col-span-3"></div>
                                </div>

                                {/* Additive row */}
                                <div className="grid grid-cols-12 gap-2 items-center py-1">
                                    <div className="col-span-2 text-sm text-gray-700">Additive</div>
                                    <div className="col-span-2">
                                        <input type="number" name="shot2_add_dosage_pct" value={formData.shot2_add_dosage_pct === 0 ? '' : formData.shot2_add_dosage_pct} onChange={handleInputChange} className="w-24 px-2 py-1 text-sm border border-gray-300 rounded-md" />
                                    </div>
                                    <div className="col-span-2">
                                        <input type="number" name="shot2_add_rate" value={formData.shot2_add_rate === 0 ? '' : formData.shot2_add_rate} onChange={handleInputChange} readOnly className="w-24 px-2 py-1 text-sm border border-gray-300 rounded-md bg-gray-100" />
                                    </div>
                                    <div className="col-span-3">
                                        <input type="number" name="shot2_add_applicable_rate" value={formData.shot2_add_applicable_rate === 0 ? '' : formData.shot2_add_applicable_rate} onChange={handleInputChange} className="w-24 px-2 py-1 text-sm border border-gray-300 rounded-md" />
                                    </div>
                                    <div className="col-span-3"></div>
                                </div>

                                {/* Regrind row - only present when Shot 2 is used */}
                                <div className="grid grid-cols-12 gap-2 items-center py-1">
                                    <div className="col-span-2 text-sm text-gray-700">Regrind</div>
                                    <div className="col-span-2">
                                        <input type="number" name="regrind_ratio_pct" value={formData.regrind_ratio_pct === 0 ? '' : formData.regrind_ratio_pct} onChange={handleInputChange} className="w-24 px-2 py-1 text-sm border border-gray-300 rounded-md" />
                                    </div>
                                    <div className="col-span-2">
                                        <input type="number" name="regrind_rate" value={formData.regrind_rate === 0 ? '' : formData.regrind_rate} onChange={handleInputChange} readOnly className="w-24 px-2 py-1 text-sm border border-gray-300 rounded-md bg-gray-100" />
                                    </div>
                                    <div className="col-span-3">
                                        <input type="number" name="regrind_applicable_rate" value={formData.regrind_applicable_rate === 0 ? '' : formData.regrind_applicable_rate} onChange={handleInputChange} className="w-24 px-2 py-1 text-sm border border-gray-300 rounded-md" />
                                    </div>
                                    <div className="col-span-3"></div>
                                </div>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}