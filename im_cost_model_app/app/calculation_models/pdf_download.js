"use client";
import { useState, useEffect } from "react";
import React from 'react';
import Summary from './summary';
import SkuDescription from './sku_description';
import MaterialCalculator from './material_cost_calculator';
import ConversionCostCalculation from './conversion_cost_calculation';
import { saveAs } from 'file-saver';
import { pdf } from '@react-pdf/renderer';

export default function PDFDownload({ mode, loadingPpRate, ppRate, allFormData, setAllFormData, loadingSummary, sheetName, sheetNameMapping }) {
    const [time, setTime] = useState("");

    useEffect(() => {
        setTime(new Date().toLocaleString());
    }, []);

    return (
        <div id="pdf-content" className="hidden print:block">(
            <div className="p-4">
                <div className="hidden print:block px-4 pt-4 pb-2">
                    <h1 className="text-xl font-bold text-center uppercase">
                        {sheetNameMapping[sheetName] ?? sheetName} Report
                    </h1>

                    <p className="text-xs text-center text-gray-600 mt-1">
                        Printed on: {time}
                    </p>

                    <hr className="my-3 border-gray-400" />
                </div>

                <div className="mb-4">
                    {/* <h2 className="text-xl font-semibold border-b pb-2 mb-2">SKU Description</h2> */}
                    <SkuDescription
                        allFormData={allFormData}
                        setAllFormData={setAllFormData}
                        sheetName={sheetName}
                    />
                </div>

                <div className="mb-4">
                    <h2 className="text-xl font-semibold border-b pb-2 mb-2">Summary</h2>
                    <div className="w-full">
                        <Summary
                            allFormData={allFormData}
                            setAllFormData={setAllFormData}
                            sheetName={sheetName}
                        />
                    </div>
                </div>


                <div className="mb-4">
                    <h2 className="text-xl font-semibold border-b pb-2 mb-2">Material Cost</h2>
                    <MaterialCalculator
                        loadingPpRate={loadingPpRate}
                        ppRate={ppRate}
                        allFormData={allFormData}
                        setAllFormData={setAllFormData}
                        loadingSummary={loadingSummary}
                        sheetName={sheetName}
                    />
                </div>

                <div className="mb-4">
                    <h2 className="text-xl font-semibold border-b pb-2 mb-2">Conversion Cost</h2>
                    <ConversionCostCalculation
                        allFormData={allFormData}
                        setAllFormData={setAllFormData}
                        sheetName={sheetName}
                    />
                </div>

                {/* <div className="mb-4">
                    <h2 className="text-xl font-semibold border-b pb-2 mb-2">Machine Cost</h2>
                    <MachineCostCalculation
                        allFormData={allFormData}
                        setAllFormData={setAllFormData}
                    />
                </div> */}
            </div>
        </div>
    );
}

export function DownloadButton() {
    const downloadPdf = async () => {
        const fileName = 'test.pdf';
        const blob = await pdf(<PDFDownload />).toBlob();
        saveAs(blob, fileName);
    };

    return <button onClick={downloadPdf}>Download PDF</button>;
};
