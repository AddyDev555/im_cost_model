'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Minus } from 'lucide-react';
import DataTable from '../../components/ui/data-table';
import ApiDataTable from '../../components/ui/api-table';

export function MaterialCalculator() {
    const [formData, setFormData] = useState({
        //INPUT DATA VARIABLES
        weight_g: '',

        shot1_ratio_pct: '',
        shot1_poly_rate: '',
        shot1_applicable_rate: '',

        shot1_mb_dosage_pct: '',
        shot1_mb_rate: '',
        shot1_mb_applicable_rate: '',

        shot1_add_dosage_pct: '',
        shot1_add_rate: '',
        shot1_add_applicable_rate: '',

        shot2_ratio_pct: '',
        shot2_poly_rate: '',
        shot2_applicable_rate: '',

        shot2_mb_dosage_pct: '',
        shot2_mb_rate: '',
        shot2_mb_applicable_rate: '',

        shot2_add_dosage_pct: '',
        shot2_add_rate: '',
        shot2_add_applicable_rate: '',

        regrind_ratio_pct: '',
        regrind_rate: '',
        regrind_applicable_rate: '',

        material_cost_per_1000_parts: '',

        //SUMMARY DATA VARIABLES
        resin_cost: '',
        resin_cost_per: '',
        resin_cost_eur: '',

        mb_cost: '',
        mb_cost_per: '',
        mb_cost_eur: '',

        add_cost: '',
        add_cost_per: '',
        add_cost_eur: '',

        material_cost: '',
        material_cost_eur: '',
        material_cost_per: ''
    });
    const didRun = useRef(false);

    const [showShot2, setShowShot2] = useState(false);
    const [calculations, setCalculations] = useState(null);
    const [loadingInputs, setLoadingInputs] = useState(true);
    const [loadingSummary, setLoadingSummary] = useState(true);
    const [ppRate, setPpRate] = useState([]);
    const [ppColumns, setPpColumns] = useState([]);

    useEffect(() => {
        if (didRun.current) return;
        didRun.current = true;

        const loadInitialData = () => {
            setLoadingInputs(true);
            setLoadingSummary(true);
            try {
                const storedData = localStorage.getItem('inputsData');
                if (storedData) {
                    const data = JSON.parse(storedData);

                    // Parse string values from backend to numbers
                    const numericData = Object.entries(data).reduce((acc, [key, value]) => {
                        if (value === null || value === '') {
                            acc[key] = '';
                        } else {
                            const cleaned = String(value).replace(/,/g, '');
                            const parsed = parseFloat(cleaned);
                            acc[key] = isNaN(parsed) ? '' : parsed;
                        }
                        return acc;
                    }, {});

                    setFormData(prev => ({ ...prev, ...numericData }));
                } else {
                    console.log("No initial data found in localStorage for Material Calculator.");
                }
            } catch (error) {
                console.error("Failed to load initial data from localStorage:", error);
            } finally {
                setLoadingInputs(false);
                setLoadingSummary(false);
            }
        };

        loadInitialData();
    }, []);

    useEffect(() => {
        async function fetchPPData() {
            try {
                const res = await fetch("http://127.0.0.1:8000/api/material/pp-rate");
                const json = await res.json();

                // json.data = array of objects
                const rows = json.data || [];

                // Auto-generate columns from keys
                if (rows.length > 0) {
                    const cols = Object.keys(rows[0]).map((key) => ({
                        accessorKey: key,
                        header: key
                    }));
                    setPpColumns(cols);
                }

                setPpRate(rows);

            } catch (err) {
                console.error("Failed to fetch:", err);
            }
        }

        fetchPPData();
    }, [])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // parse value strictly: empty -> '' , valid number -> parsed number, invalid -> ''
        const parsed = value === '' ? '' : parseFloat(String(value).replace(/,/g, ''));
        const numValue = parsed === '' || Number.isNaN(parsed) ? '' : parsed;

        setFormData(prev => {
            return { ...prev, [name]: numValue };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoadingSummary(true);

        // Clear all applicable_rate inputs on hot-calculate
        setFormData(prev => ({
            ...prev,
            shot1_applicable_rate: '',
            shot1_mb_applicable_rate: '',
            shot1_add_applicable_rate: '',
            shot2_applicable_rate: '',
            shot2_mb_applicable_rate: '',
            shot2_add_applicable_rate: '',
            regrind_applicable_rate: '',
        }));

        // Create a temporary payload for the API, overriding rates with applicable rates where provided.
        const payload = { ...formData };
        const rateMap = {
            'shot1_applicable_rate': 'shot1_poly_rate',
            'shot1_mb_applicable_rate': 'shot1_mb_rate',
            'shot1_add_applicable_rate': 'shot1_add_rate',
            'shot2_applicable_rate': 'shot2_poly_rate',
            'shot2_mb_applicable_rate': 'shot2_mb_rate',
            'shot2_add_applicable_rate': 'shot2_add_rate',
            'regrind_applicable_rate': 'regrind_rate',
        };

        for (const applicableKey in rateMap) {
            const rateKey = rateMap[applicableKey];
            const applicableValue = formData[applicableKey];
            if (applicableValue !== '' && applicableValue !== null && applicableValue !== undefined) {
                payload[rateKey] = applicableValue;
            }
        }

        try {
            fetch('http://127.0.0.1:8000/api/material/update-inputs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Send the temporary payload with overwritten rates
                body: JSON.stringify(payload),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success && data.data) {
                        const numericData = Object.entries(data.data).reduce((acc, [key, value]) => {
                            if (value === '' || value === null) {
                                acc[key] = '';
                            } else {
                                const cleaned = String(value).replace(/,/g, '');
                                acc[key] = parseFloat(cleaned);
                            }
                            return acc;
                        }, {});

                        setFormData(prev => ({
                            ...prev,
                            ...numericData  // now numbers from server
                        }));
                        setLoadingSummary(false);
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                    setLoadingSummary(false);
                });

        } catch (err) {
            console.error('Error:', err);
        }
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
                                    value={formData.weight_g}
                                    onChange={handleInputChange}
                                    className="w-14 px-2 py-0.5 text-sm border border-gray-300 rounded"
                                />
                            </div>
                            <div className="col-span-20 sm:col-span-6 flex gap-2 justify-end mt-2 sm:mt-0">
                                <button
                                    type="submit"
                                    className="px-3 py-1 bg-violet-600 text-white rounded-md cursor-pointer font-medium transition-colors text-sm"
                                >
                                    Calculate
                                </button>
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
                                <div className="bg-gray-50 border rounded p-3">
                                    <h3 className='font-bold pb-3'>Material Inputs</h3>
                                    {(() => {
                                        const columnsInputs = [
                                            { key: 'label', title: 'Material' },
                                            {
                                                key: 'ratio', title: 'Percentage', render: (row) => (
                                                    <input
                                                        type="number"
                                                        name={row.ratioName}
                                                        value={formData[row.ratioName] || ''}
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
                                                        value={formData[row.rateName] || ''}
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
                                                        value={formData[row.applicableName] || ''}
                                                        onChange={handleInputChange}
                                                        className="w-full px-2 py-0.5 text-sm border border-gray-300"
                                                    />
                                                )
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

                                        if (loadingInputs) {
                                            return (
                                                <div>
                                                    {inputRows.map((r, idx) => (
                                                        <div key={idx} className="grid grid-cols-12 gap-2 items-center py-2">
                                                            <div className="col-span-4 h-4 bg-gray-200 rounded animate-pulse" />
                                                            <div className="col-span-3 h-4 bg-gray-200 rounded animate-pulse" />
                                                            <div className="col-span-3 h-4 bg-gray-200 rounded animate-pulse" />
                                                            <div className="col-span-2 h-4 bg-gray-200 rounded animate-pulse" />
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        }

                                        return <DataTable columns={columnsInputs} data={inputRows} />;
                                    })()}
                                </div>

                                {/* Column 2: Results / Summary using DataTable */}
                                <div>
                                    <div className="bg-gray-50 border rounded p-3">
                                        <h3 className='font-bold pb-3'>Material Summary</h3>
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
                                                    inr: `₹${Number(formData.resin_cost || 0).toFixed(1)}`,
                                                    eur: `€${Number(formData.resin_cost_eur || 0).toFixed(1)}`,
                                                    pct: `${Number(formData.resin_cost_per || 0).toFixed(1)}%`,
                                                },
                                                {
                                                    label: "Masterbatch",
                                                    inr: `₹${Number(formData.mb_cost || 0).toFixed(1)}`,
                                                    eur: `€${Number(formData.mb_cost_eur || 0).toFixed(1)}`,
                                                    pct: `${Number(formData.mb_cost_per || 0).toFixed(1)}%`,
                                                },
                                                {
                                                    label: "Additive",
                                                    inr: `₹${Number(formData.add_cost || 0).toFixed(1)}`,
                                                    eur: `€${Number(formData.add_cost_eur || 0).toFixed(1)}`,
                                                    pct: `${Number(formData.add_cost_per || 0).toFixed(1)}%`,
                                                },
                                                {
                                                    label: "Total",
                                                    inr: `₹${Number(formData.material_cost || 0).toFixed(1)}`,
                                                    eur: `€${Number(formData.material_cost_eur || 0).toFixed(1)}`,
                                                    pct: `${Number(formData.material_cost_per || 100).toFixed(1)}%`,
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
                                    <div className="bg-gray-50 border rounded p-3 h-full items-center justify-center text-sm text-gray-400">
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