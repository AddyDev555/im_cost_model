'use client';
import React, { useEffect, useState, useRef } from 'react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import MaterialCalculator from './calculation_models/material_cost_calculator';
import Summary from './calculation_models/summary';
import SkuDescription from './calculation_models/sku_description';
import ConversionCostCalculation from './calculation_models/conversion_cost_calculation';
import SlateEditor from '../components/ui/richTextBox';
import PDFDownload from './calculation_models/pdf_download';
import { NotebookPen, FileText } from 'lucide-react';
import { api } from "@/utils/api";
import { toast } from 'react-toastify';

/* ============================
   SHEET NAME MAP
============================ */
const sheetNameMapping = {
  im_cost_model: "IM Cost Model",
  carton_cost_model: "Carton Cost Model",
  corrugate_cost_model: "Corrugate Cost Model",
  rigid_ebm_cost_model: "Rigid EBM Cost Model",
  rigid_isbm1_cost_model: "Rigid ISBM1 Cost Model",
  rigid_isbm2_cost_model: "Rigid ISBM2 Cost Model"
};

/* ============================
   CACHE HELPERS
============================ */
const CACHE_KEY = "inputsData";
const CACHE_TS_KEY = "inputsDataTimestamp";
const CACHE_SHEET_KEY = "inputsDataSheetName";

export default function Page() {
  const [allFormData, setAllFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const [sheetName, setSheetName] = useState(
    Object.keys(sheetNameMapping)[0]
  );

  /* ============================
     NOTES STATE
  ============================ */
  const [isNotesVisible, setIsNotesVisible] = useState(false);
  const notesEditorRef = useRef(null);
  const notesButtonRef = useRef(null);
  const [notes, setNotes] = useState("");
  const isInitialNotesLoad = useRef(true);

  /* ============================
     FETCH INPUT DATA
  ============================ */
  const initializeApp = async () => {
    setIsLoading(true);

    const cachedData = localStorage.getItem(CACHE_KEY);
    const cachedTs = localStorage.getItem(CACHE_TS_KEY);
    const cachedSheet = localStorage.getItem(CACHE_SHEET_KEY);

    const oneDay = 24 * 60 * 60 * 1000;

    const isValidCache =
      cachedData &&
      cachedTs &&
      cachedSheet === sheetName &&
      Date.now() - Number(cachedTs) < oneDay;

    /* ============================
       USE CACHE ONLY IF SAME SHEET
    ============================ */
    if (isValidCache) {
      console.log(`Using cached data for ${sheetName}`);
      setAllFormData(JSON.parse(cachedData));
      setIsLoading(false);
      return;
    }

    /* ============================
       CLEAN OLD CACHE ON SHEET CHANGE
    ============================ */
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_TS_KEY);
    localStorage.removeItem(CACHE_SHEET_KEY);

    try {
      console.log(`Fetching fresh data for ${sheetName}`);

      const payload = {
        mode: "fetch",
        modelName: sheetName,
      };

      const result = await api.post("/api/inputs/get-inputs-data", payload);

      if (result?.success && result?.inputData) {
        localStorage.setItem(CACHE_KEY, JSON.stringify(result));
        localStorage.setItem(CACHE_TS_KEY, Date.now().toString());
        localStorage.setItem(CACHE_SHEET_KEY, sheetName);

        setAllFormData(result);
      } else {
        console.error("Invalid backend response", result);
      }
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  /* ============================
     RUN ON SHEET CHANGE
  ============================ */
  useEffect(() => {
    initializeApp();
  }, [sheetName]);

  /* ============================
     NOTES FETCH
  ============================ */
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/notes/get-notes');
        const data = await res.json();

        if (Array.isArray(data?.notes)) {
          setNotes(
            data.notes.map(n => ({
              type: 'paragraph',
              children: [{ text: n.content || '' }],
            }))
          );
          isInitialNotesLoad.current = true;
        }
      } catch (err) {
        console.error("Notes fetch error:", err);
      }
    };

    fetchNotes();
  }, []);

  /* ============================
     NOTES SAVE (DEBOUNCED)
  ============================ */
  useEffect(() => {
    if (isInitialNotesLoad.current) {
      isInitialNotesLoad.current = false;
      return;
    }

    if (!notes) return;

    const timer = setTimeout(() => {
      const payload = notes.map(n => ({
        content: n.children.map(c => c.text).join("")
      }));

      fetch('http://127.0.0.1:8000/api/notes/update-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: payload }),
      })
        .then(r => r.json())
        .then(r => r.success && toast.success("Notes saved"))
        .catch(console.error);

    }, 3000);

    return () => clearTimeout(timer);
  }, [notes]);

  /* ============================
     CLICK OUTSIDE NOTES
  ============================ */
  useEffect(() => {
    const handler = (e) => {
      if (
        isNotesVisible &&
        notesEditorRef.current &&
        !notesEditorRef.current.contains(e.target) &&
        notesButtonRef.current &&
        !notesButtonRef.current.contains(e.target)
      ) {
        setIsNotesVisible(false);
      }
    };

    if (isNotesVisible) {
      document.addEventListener("mousedown", handler);
    }

    return () => document.removeEventListener("mousedown", handler);
  }, [isNotesVisible]);

  /* ============================
     ACTIONS
  ============================ */
  const handleReset = () => {
    const cached = localStorage.getItem(CACHE_KEY);
    const cachedSheet = localStorage.getItem(CACHE_SHEET_KEY);

    if (cached && cachedSheet === sheetName) {
      setAllFormData(JSON.parse(cached));

      const payload = {
        mode: "update",
        modelName: sheetName,
        inputData: JSON.parse(cached).inputData || [],
      };

      fetch("http://127.0.0.1:8000/api/updates/update-inputs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then(res => res.json())
        .then(res => {
          if (!res.success) throw new Error("Update failed");
          console.log("Reset Done from backend as well!");
        })
        .catch(console.error)
        .finally(() => setLoadingSummary(false));
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoadingSummary(true);

    const payload = {
      mode: "update",
      modelName: sheetName,
      inputData: allFormData.inputData || [],
    };

    fetch("http://127.0.0.1:8000/api/updates/update-inputs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .then(res => {
        if (!res.success) throw new Error("Update failed");

        setAllFormData(prev => ({
          ...prev,
          summaryData: res.summaryData || [],
        }));
      })
      .catch(console.error)
      .finally(() => setLoadingSummary(false));
  };

  const printWithFilename = () => {
    const originalTitle = document.title;
    const now = new Date();
    document.title = `${now.toISOString().replace(/[:.]/g, '-')}_${sheetName}`;
    window.print();
    document.title = originalTitle;
  };

  /* ============================
     LOADING UI
  ============================ */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-violet-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /* ============================
     RENDER
  ============================ */
  return (
    <div>
      <div className="px-4 print:hidden">
        <div className="flex justify-between items-center px-4 py-2 bg-white shadow rounded">
          <SkuDescription allFormData={allFormData} setAllFormData={setAllFormData} sheetName={sheetName} />

          <div>
            <div>
              <select
                value={sheetName}
                onChange={(e) => setSheetName(e.target.value)}
                className="border px-1 py-1 rounded mb-1"
              >
                {Object.entries(sheetNameMapping).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div className='flex gap-1'>
              <button onClick={handleReset} className="bg-gray-500 hover:bg-gray-600 cursor-pointer text-white px-6 py-1 rounded">
                Reset
              </button>

              <button onClick={handleSubmit} className="bg-violet-500 hover:bg-violet-600 cursor-pointer text-white px-6 py-1 rounded">
                Calculate
              </button>
            </div>
          </div>
        </div>

        <Accordion type="single" collapsible>
          <AccordionItem value="summary">
            <AccordionTrigger className="font-semibold cursor-pointer border py-1 shadow-sm border-violet-400 px-4 mt-2 hover:no-underline">Summary</AccordionTrigger>
            <AccordionContent>
              <Summary sheetName={sheetName} allFormData={allFormData} setAllFormData={setAllFormData} loadingSummary={loadingSummary} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="material">
            <AccordionTrigger className="font-semibold cursor-pointer border py-1 shadow-sm border-violet-400 px-4 mt-2 hover:no-underline">Material Cost</AccordionTrigger>
            <AccordionContent>
              <MaterialCalculator
                sheetName={sheetName}
                allFormData={allFormData}
                setAllFormData={setAllFormData}
                loadingSummary={loadingSummary}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="conversion">
            <AccordionTrigger className="font-semibold cursor-pointer border py-1 shadow-sm border-violet-400 px-4 mt-2 hover:no-underline">Conversion Cost</AccordionTrigger>
            <AccordionContent>
              <ConversionCostCalculation
                allFormData={allFormData}
                setAllFormData={setAllFormData}
                loadingSummary={loadingSummary}
                sheetName={sheetName}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div id="pdf-content">
        <PDFDownload
          allFormData={allFormData}
          setAllFormData={setAllFormData}
          loadingSummary={loadingSummary}
          sheetName={sheetName}
        />
      </div>

      {isNotesVisible && (
        <div ref={notesEditorRef} className="fixed bottom-20 right-8 z-50">
          <SlateEditor notes={notes} setNotes={setNotes} />
        </div>
      )}

      <div className="fixed bottom-4 right-8 z-50 flex items-center gap-2 print:hidden">
        <button onClick={printWithFilename} className="cursor-pointer px-4 py-2 bg-white border border-red-400 font-semibold rounded flex items-center justify-center shadow-lg hover:bg-red-400 hover:text-white transition-colors" aria-label="Download PDF" > {/* <Download className="w-5 h-5" /> */}
          <div className="flex align-center">
            <p className="text-sm pr-2">Save pdf</p>
            <FileText className="w-5 h-5" /> </div>
        </button>
        <button ref={notesButtonRef} onClick={() => setIsNotesVisible(!isNotesVisible)} className="cursor-pointer w-10 h-10 bg-violet-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-violet-600 transition-colors" aria-label="Toggle notes editor" >
          <NotebookPen className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
