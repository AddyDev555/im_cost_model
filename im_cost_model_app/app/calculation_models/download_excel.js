import React, { useState } from "react";
import { FileSpreadsheet } from 'lucide-react';


const SaveExcelButton = ({ sheetName, mode = "update" }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDownload = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch("http://127.0.0.1:8000/api/download/get_sheetId", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sheetName, mode }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail);
            }

            const data = await res.json();

            const {
                sheetId,
                sheetName: backendSheetName,
                mode: backendMode,
            } = data;

            const format = "xlsx";

            const url =
                `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=${format}`;

            // Redirect download
            window.location.href = url;

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div>
            <button
                onClick={handleDownload}
                disabled={loading}
                className="py-1.5 bg-white px-4 border shadow-lg font-semibold cursor-pointer hover:bg-green-700 hover:text-white border-green-600 text-sm rounded"
            >
                {loading ? (
                    "Preparing..."
                ) : (
                    <div className="flex gap-2 items-center">
                        <p>Save Excel</p>
                        <FileSpreadsheet width={20} style={{ marginLeft: "2px" }} />
                    </div>
                )}
            </button>

            {error && (
                <p style={{ color: "red", marginTop: "8px" }}>
                    {error}
                </p>
            )}
        </div>
    );
};

export default SaveExcelButton;