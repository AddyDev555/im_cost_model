'use client';
import React, { useEffect, useState, useRef } from 'react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import MaterialCalculator from './calculation_models/material_cost_calculator';
import Summary from './calculation_models/summary';
import SkuDescription from './calculation_models/sku_description';
import ConversionCostCalculation from './calculation_models/conversion_cost_calculation';
import SlateEditor from '../components/ui/richTextBox';
import PDFDownload from './calculation_models/pdf_download';
import { NotebookPen, Download, FileText, MessageCircle } from 'lucide-react';
import { api } from "@/utils/api";
import { toast } from 'react-toastify';

// Remove these static imports:
// import domtoimage from "dom-to-image-more";
// import jsPDF from "jspdf";

export default function page() {
  const [allFormData, setAllFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isNotesVisible, setIsNotesVisible] = useState(false);
  const notesEditorRef = useRef(null);
  const notesButtonRef = useRef(null);
  const chatSheetRef = useRef(null);
  const chatButtonRef = useRef(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [notes, setNotes] = useState("");
  const isInitialNotesLoad = useRef(true);
  const [isChatVisible, setIsChatVisible] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      const cachedData = localStorage.getItem("inputsData");
      const storedDataTimestamp = localStorage.getItem('inputsDataTimestamp');
      const oneDay = 24 * 60 * 60 * 1000; // 1 day in milliseconds

      if (cachedData && storedDataTimestamp && (new Date().getTime() - parseInt(storedDataTimestamp, 10) < oneDay)) {
        console.log('Using cached data from localStorage as it is less than 1 day old.');
        setAllFormData(JSON.parse(cachedData));
        setIsLoading(false);
        return;
      }

      // If no recent cache, fetch new data
      try {
        console.log('Fetching new data from backend...');

        const payload = {
          mode: "fetch",
          modelName: "im_cost_model"
        };

        const result = await api.post("/api/inputs/get-inputs-data", payload);

        if (result.success && result.inputData) {
          localStorage.setItem("inputsData", JSON.stringify(result));
          localStorage.setItem("inputsDataTimestamp", new Date().getTime().toString());
          setAllFormData(result);
          console.log("Inputs data has been successfully fetched and stored in localStorage.");
        } else {
          console.error("Failed to get data from backend:", result.error || "Unknown error");
        }
      } catch (error) {
        console.error('An error occurred while fetching inputs data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/notes/get-notes');
        const data = await response.json();
        // Transform the notes data to be compatible with Slate's format.
        if (data.notes && Array.isArray(data.notes)) {
          const slateNotes = data.notes.map(note => ({
            type: 'paragraph',
            children: [{ text: note.content || '' }],
          }));
          setNotes(slateNotes);
          isInitialNotesLoad.current = true; // Prevent saving on initial fetch
        }
      } catch (error) {
        console.error('Failed to fetch notes:', error);
      }
    };

    fetchNotes();
  }, []);

  // Debounced effect to save notes to the backend
  useEffect(() => {
    // Don't save on the initial load when notes are first fetched.
    if (isInitialNotesLoad.current) {
      isInitialNotesLoad.current = false;
      return;
    }

    // If notes is empty (e.g., after initialization), don't save.
    if (!notes || notes === "") {
      return;
    }

    const handler = setTimeout(() => {
      // Transform Slate's format to the simple format for the backend.
      const notesToSave = notes.map(node => {
        // Extract text from all children of a node (like a paragraph)
        const content = node.children.map(child => child.text).join('');
        return { content };
      });

      fetch('http://127.0.0.1:8000/api/notes/update-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Send the transformed data
        body: JSON.stringify({ notes: notesToSave }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            toast.success('Notes saved!');
          }
        })
        .catch(err => console.error("Failed to save notes:", err));
    }, 3000); // 3-second debounce delay

    return () => clearTimeout(handler);
  }, [notes]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (isNotesVisible &&
        notesEditorRef.current &&
        !notesEditorRef.current.contains(event.target) &&
        notesButtonRef.current &&
        !notesButtonRef.current.contains(event.target)
      ) {
        setIsNotesVisible(false);
      }
      if (isChatVisible &&
        chatSheetRef.current &&
        !chatSheetRef.current.contains(event.target) &&
        chatButtonRef.current &&
        !chatButtonRef.current.contains(event.target)
      ) {
        setIsChatVisible(false);
      }
    }

    if (isNotesVisible || isChatVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotesVisible, isChatVisible]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-violet-400 border-t-transparent border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-600">Loading Data...</p>
        </div>
      </div>
    );
  }

  const handleReset = () => {
    const cachedData = localStorage.getItem("inputsData");
    if (cachedData) {
      console.log('Resetting form data from localStorage.');
      setAllFormData(JSON.parse(cachedData));
    } else {
      console.log('No data in localStorage to reset to.');
    }
  };

  const printWithFilename = () => {

    setTimeout(() => {
      const originalTitle = document.title;
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      const hh = String(now.getHours()).padStart(2, '0');
      const min = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      const filename = `${yyyy}-${mm}-${dd}_${hh}-${min}-${ss}_IMCostModel`;

      document.title = filename;
      window.print();
      document.title = originalTitle;

    }, 100); // Small delay to allow state to update and components to re-render
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    setLoadingSummary(true);

    // ✅ Build payload in generalized structure
    const payload = {
      mode:"update",
      modelName: "im_cost_model",
      inputData: allFormData.inputData || []
    };

    fetch("http://127.0.0.1:8000/api/updates/update-inputs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .then(res => {
        if (!res.success) {
          throw new Error("Update failed");
        }

        setAllFormData(prev => ({
          ...prev,
          summaryData: res.summaryData || []
        }));

        setLoadingSummary(false);
      })
      .catch(err => {
        console.error("Submit error:", err);
        setLoadingSummary(false);
      });
  };



  return (
    <div>
      <div className="px-4 print:hidden">
        <div className="flex flex-col md:flex-row items-center justify-between w-full px-4 py-2 bg-white shadow-sm rounded-md">
          <div className="flex items-center gap-2 pt-2">
            {/* <img src="./logo-tej-teams.png" alt="logo" className="w-6 h-6" />
            <h2 className="text-xl font-semibold tracking-tight">
              Tej Teams
            </h2> */}

            <SkuDescription
              allFormData={allFormData}
              setAllFormData={setAllFormData}
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2 mt-6">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-1 bg-gray-500 cursor-pointer text-white rounded text-sm font-medium 
                 hover:bg-gray-600 transition shadow-sm"
            >
              Reset
            </button>

            <button
              type="submit"
              onClick={handleSubmit}
              className="px-4 py-1 bg-violet-500 cursor-pointer text-white rounded text-sm font-medium 
                 hover:bg-violet-700 transition shadow-sm"
            >
              Calculate
            </button>
          </div>
        </div>

        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="font-semibold cursor-pointer border py-1 shadow-sm border-violet-400 px-4 mt-2 hover:no-underline">
              Summary
            </AccordionTrigger>
            <AccordionContent>
              <Summary
                allFormData={allFormData}
                setAllFormData={setAllFormData}
              />
            </AccordionContent>
          </AccordionItem>

          {/* <AccordionItem value="item-2">
            <AccordionTrigger className="font-semibold cursor-pointer border py-1 shadow-sm border-violet-400 px-4 mt-2 hover:no-underline">
              SKU Description
            </AccordionTrigger>
            <AccordionContent>
              <SkuDescription
                allFormData={allFormData}
                setAllFormData={setAllFormData}
              />
            </AccordionContent>
          </AccordionItem> */}

          <AccordionItem value="item-3">
            <AccordionTrigger className="font-semibold cursor-pointer border py-1 shadow-sm border-violet-400 px-4 mt-2 hover:no-underline">
              Material Cost
            </AccordionTrigger>
            <AccordionContent>
              <MaterialCalculator
                allFormData={allFormData}
                setAllFormData={setAllFormData}
                loadingSummary={loadingSummary}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="font-semibold cursor-pointer border py-1 shadow-sm border-violet-400 px-4 mt-2 hover:no-underline">
              Conversion Cost
            </AccordionTrigger>
            <AccordionContent>
              <ConversionCostCalculation
                allFormData={allFormData}
                setAllFormData={setAllFormData}
                loadingSummary={loadingSummary}
              />
            </AccordionContent>
          </AccordionItem>

          {/* <AccordionItem value="item-5">
            <AccordionTrigger className="font-semibold cursor-pointer border py-1 shadow-sm border-violet-400 px-4 mt-2 hover:no-underline">
              Machine Cost
            </AccordionTrigger>
            <AccordionContent>
              <MachineCostCalculation
                allFormData={allFormData}
                setAllFormData={setAllFormData}
              />
            </AccordionContent>
          </AccordionItem> */}
        </Accordion>
      </div>

      {/* Hidden container for PDF/Print */}
      <div id="pdf-content">
        <PDFDownload
          allFormData={allFormData}
          setAllFormData={setAllFormData}
          loadingSummary={loadingSummary}
        />
      </div>

      {/* Floating Notes Editor */}
      {isNotesVisible && (
        <div ref={notesEditorRef} className="fixed bottom-20 right-8 z-50">
          <SlateEditor notes={notes} setNotes={setNotes} />
        </div>
      )}

      {/* Floating Chat Component */}
      {/* {isChatVisible && (
        <div ref={chatSheetRef} className="fixed bottom-20 right-8 z-50">
          <ChatWithSheet />
        </div>
      )} */}

      {/* Floating Action Buttons */}
      <div className="fixed bottom-4 right-8 z-50 flex items-center gap-2 print:hidden">
        <button
          onClick={printWithFilename}
          className="cursor-pointer px-4 py-2 bg-white border border-red-400 font-semibold rounded flex items-center justify-center shadow-lg hover:bg-red-400 hover:text-white transition-colors"
          aria-label="Download PDF"
        >
          {/* <Download className="w-5 h-5" /> */}
          <div className="flex align-center">
            <p className="text-sm pr-2">Save pdf</p>
            <FileText className="w-5 h-5" />
          </div>
        </button>
        <button
          ref={notesButtonRef}
          onClick={() => setIsNotesVisible(!isNotesVisible)}
          className="cursor-pointer w-10 h-10 bg-violet-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-violet-600 transition-colors"
          aria-label="Toggle notes editor"
        >
          <NotebookPen className="w-5 h-5" />
        </button>
        {/* <button
          ref={chatButtonRef}
          onClick={() => setIsChatVisible(!isChatVisible)}
          className="cursor-pointer w-10 h-10 bg-violet-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-violet-600 transition-colors"
          aria-label="Toggle chat"
        >
          <MessageCircle className="w-5 h-5" />
        </button> */}
      </div>
    </div>
  );

}