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
import SaveExcelButton from './calculation_models/download_excel';
import MagicLinkDialog from '../components/ui/userVerification';

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
  const [countryName, setCountryName] = useState("India");
  const [ppRate, setPpRate] = useState([]);
  const [loadingPpRate, setLoadingPpRate] = useState(false);

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

    const cachedDataRaw = localStorage.getItem(CACHE_KEY);
    const cachedData = cachedDataRaw ? JSON.parse(cachedDataRaw) : null;
    const cachedTs = localStorage.getItem(CACHE_TS_KEY);
    const cachedSheet = localStorage.getItem(CACHE_SHEET_KEY);

    const oneDay = 24 * 60 * 60 * 1000;

    const isValidCache =
      cachedData &&
      cachedTs &&
      cachedSheet === sheetName &&
      Date.now() - Number(cachedTs) < oneDay;

    /* USE CACHE IF VALID */
    if (cachedData?.inputsData === allFormData.inputData && isValidCache) {
      console.log(`Using cached data for ${sheetName}`);
      setAllFormData(cachedData);
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
        countryName: countryName
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
  }, [sheetName, countryName]);

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

      //   const payload = {
      //     mode: "update",
      //     modelName: sheetName,
      //     inputData: JSON.parse(cached).inputData || [],
      //   };

      //   fetch("http://127.0.0.1:8000/api/updates/update-inputs", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify(payload),
      //   })
      //     .then(res => res.json())
      //     .then(res => {
      //       if (!res.success) throw new Error("Update failed");
      //       console.log("Reset Done from backend as well!");
      //     })
      //     .catch(console.error)
      //     .finally(() => setLoadingSummary(false));
      // };
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const userCred = localStorage.getItem("user_cred");
    if (!userCred) {
      toast.warning("Please Login to Calculate!");
      return;
    }

    setLoadingSummary(true);

    const payload = {
      mode: "update",
      modelName: sheetName,
      email: JSON.parse(userCred).email,
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
        if (res.status === 401) {
          toast.warning(res.detail || "Login required to calculate");
          return;
        }
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
  // if (isLoading) {
  //   return (
  //     <div className="flex flex-col items-center justify-center h-screen">
  //       <div className="w-16 h-16 border-4 border-violet-400 border-t-transparent rounded-full animate-spin" />
  //       <h1 className="text-slate-500 text-center p-2 pl-3 align-center">Loading...</h1>
  //     </div>
  //   );
  // }

  /* ---------------------------------------------
         POLYMER PRICES (IM only)
      --------------------------------------------- */
  useEffect(() => {
    const fetchPPData = async () => {
      setLoadingPpRate(true);
      try {
        const json = await api.get("/api/material/pp-rate");
        setPpRate(json.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingPpRate(false);
      }
    };

    fetchPPData();
  }, [sheetName]);

  /* ============================
     RENDER
  ============================ */
  return (
    <div>
      <div className="px-4 print:hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 py-2 bg-white shadow rounded gap-2 md:gap-0">
          <SkuDescription isLoading={isLoading} allFormData={allFormData} setAllFormData={setAllFormData} sheetName={sheetName} setCountryName={setCountryName} />

          <div>
            <div className="flex items-center gap-3">
              <select
                value={sheetName}
                onChange={(e) => setSheetName(e.target.value)}
                className="text-sm border px-1 py-1 rounded mb-1"
              >
                {Object.entries(sheetNameMapping).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>

              <MagicLinkDialog />
            </div>
            <div className='flex gap-1'>
              <button onClick={handleReset} className="text-sm bg-gray-500 hover:bg-gray-600 cursor-pointer text-white px-5.5 py-1 rounded">
                Reset
              </button>

              <button onClick={handleSubmit} className="text-sm bg-white hover:bg-slate-50 cursor-pointer border border-violet-500 px-5.5 py-1 rounded">
                Calculate
              </button>

            </div>
          </div>
        </div>

        <Accordion type="single" collapsible>
          <AccordionItem value="summary">
            <AccordionTrigger className="font-semibold cursor-pointer border py-1 shadow-sm border-violet-400 px-4 mt-2 hover:no-underline">Summary</AccordionTrigger>
            <AccordionContent>
              <Summary isLoading={isLoading} sheetName={sheetName} allFormData={allFormData} setAllFormData={setAllFormData} loadingSummary={loadingSummary} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="material">
            <AccordionTrigger className="font-semibold cursor-pointer border py-1 shadow-sm border-violet-400 px-4 mt-2 hover:no-underline">Material Cost</AccordionTrigger>
            <AccordionContent>
              <MaterialCalculator
                ppRate={ppRate}
                loadingPpRate={loadingPpRate}
                isLoading={isLoading}
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
                isLoading={isLoading}
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
          loadingPpRate={loadingPpRate}
          ppRate={ppRate}
          isLoading={isLoading}
          allFormData={allFormData}
          setAllFormData={setAllFormData}
          loadingSummary={loadingSummary}
          sheetName={sheetName}
          sheetNameMapping={sheetNameMapping}
        />
      </div>

      {isNotesVisible && (
        <div ref={notesEditorRef} className="fixed bottom-20 right-8 z-50">
          <SlateEditor notes={notes} setNotes={setNotes} />
        </div>
      )}

      <div className="fixed bottom-4 right-8 z-50 flex items-center gap-2 print:hidden">
        <div>
          <SaveExcelButton sheetName={sheetName} mode="update" />
        </div>
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