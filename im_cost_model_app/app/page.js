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
          setAllFormData(response.data);
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

  return (
    <div>
      <div className="px-4">
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
