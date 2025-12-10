'use client';
import React, { useEffect, useState, useRef } from 'react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import MaterialCalculator from './calculation_models/material_cost_calculator';
import SKUDescription from './calculation_models/sku_description';
import ConversionCostCalculation from './calculation_models/conversion_cost_calculation';
import MachineCostCalculation from './calculation_models/machine_cost_calculation';
import SlateEditor from '../components/ui/richTextBox';

import { NotebookPen } from 'lucide-react';
import { api } from "@/utils/api";

export default function page() {
  const [allFormData, setAllFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isNotesVisible, setIsNotesVisible] = useState(false);
  const notesEditorRef = useRef(null);
  const notesButtonRef = useRef(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

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
        const result = await api.get("/api/inputs/get-inputs-data");

        if (result.success && result.data) {
          localStorage.setItem("inputsData", JSON.stringify(result.data));
          localStorage.setItem("inputsDataTimestamp", new Date().getTime().toString());
          setAllFormData(result.data);
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
    function handleClickOutside(event) {
      if (
        notesEditorRef.current &&
        !notesEditorRef.current.contains(event.target) &&
        notesButtonRef.current &&
        !notesButtonRef.current.contains(event.target)
      ) {
        setIsNotesVisible(false);
      }
    }

    if (isNotesVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotesVisible]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoadingSummary(true);

    // Clear applicable_rate inputs
    setAllFormData(prev => ({
      ...prev,
      shot1_applicable_rate: '',
      shot1_mb_applicable_rate: '',
      shot1_add_applicable_rate: '',
      shot2_applicable_rate: '',
      shot2_mb_applicable_rate: '',
      shot2_add_applicable_rate: '',
      regrind_applicable_rate: '',
    }));

    const payload = { ...allFormData };
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
      const applicableValue = allFormData[applicableKey];
      if (applicableValue !== '' && applicableValue !== null && applicableValue !== undefined) {
        payload[rateKey] = applicableValue;
      }
    }

    fetch('http://127.0.0.1:8000/api/updates/update-inputs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
          setAllFormData(prev => ({ ...prev, ...numericData }));
          setLoadingSummary(false);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setLoadingSummary(false);
      });
  };

  return (
    <div>
      <div className="px-4">
        <div className="flex items-center justify-between w-full px-4 py-2 bg-white shadow-sm rounded-md">
          <div className="flex items-center gap-2">
            <img src="./logo-tej-teams.png" alt="logo" className="w-6 h-6" />
            <h2 className="text-xl font-semibold tracking-tight">
              Tej Teams
            </h2>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2">
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
              SKU Description
            </AccordionTrigger>
            <AccordionContent>
              <SKUDescription
                allFormData={allFormData}
                setAllFormData={setAllFormData}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="font-semibold cursor-pointer border py-1 shadow-sm border-violet-400 px-4 mt-2 hover:no-underline">
              Material Cost Model
            </AccordionTrigger>
            <AccordionContent>
              <MaterialCalculator
                allFormData={allFormData}
                setAllFormData={setAllFormData}
                loadingSummary={loadingSummary}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="font-semibold cursor-pointer border py-1 shadow-sm border-violet-400 px-4 mt-2 hover:no-underline">
              Conversion Cost Model
            </AccordionTrigger>
            <AccordionContent>
              <ConversionCostCalculation
                allFormData={allFormData}
                setAllFormData={setAllFormData}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="font-semibold cursor-pointer border py-1 shadow-sm border-violet-400 px-4 mt-2 hover:no-underline">
              Machine Cost Model
            </AccordionTrigger>
            <AccordionContent>
              <MachineCostCalculation
                allFormData={allFormData}
                setAllFormData={setAllFormData}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Floating Notes Editor */}
      {isNotesVisible && (
        <div ref={notesEditorRef} className="fixed bottom-20 right-8 z-50">
          <SlateEditor />
        </div>
      )}

      {/* Floating Action Button to toggle notes */}
      <button
        ref={notesButtonRef}
        onClick={() => setIsNotesVisible(!isNotesVisible)}
        className="fixed bottom-8 right-8 z-50 w-10 h-10 bg-violet-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-violet-600 transition-colors"
        aria-label="Toggle notes editor"
      >
        <NotebookPen className="w-5 h-5" />
      </button>
    </div>
  );

}
