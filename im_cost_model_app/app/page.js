'use client';
import React, { useEffect, useState } from 'react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import  MaterialCalculator  from './calculation_models/material_cost_calculator';
import SKUDescription from './calculation_models/sku_description';
import ConversionCostCalculation from './calculation_models/conversion_cost_calculation';
import MachineCostCalculation from './calculation_models/machine_cost_calculation';

export default function page() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      const storedDataTimestamp = localStorage.getItem('inputsDataTimestamp');
      const oneDay = 24 * 60 * 60 * 1000; // 1 day in milliseconds

      if (storedDataTimestamp && (new Date().getTime() - parseInt(storedDataTimestamp, 10) < oneDay)) {
        console.log('Using cached data from localStorage as it is less than 1 day old.');
        setIsLoading(false);
        return;
      }

      // If no recent cache, fetch new data
      try {
        console.log('Fetching new data from backend...');
        const response = await fetch('http://127.0.0.1:8000/api/inputs/get-inputs-data');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        if (result.success && result.data) {
          localStorage.setItem('inputsData', JSON.stringify(result.data));
          localStorage.setItem('inputsDataTimestamp', new Date().getTime().toString());
          console.log('Inputs data has been successfully fetched and stored in localStorage.');
        } else {
          console.error('Failed to get data from backend:', result.error || 'Unknown error');
        }
      } catch (error) {
        console.error('An error occurred while fetching inputs data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

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
      {/* <h1 className="text-3xl font-semibold px-4 py-2">IM Cost Model</h1> */}
      <div className="px-4">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="font-semibold cursor-pointer border py-1 shadow-sm border-violet-400 px-4 mt-2 hover:no-underline">
              SKU Description
            </AccordionTrigger>
            <AccordionContent>
              <SKUDescription />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="font-semibold cursor-pointer border py-1 shadow-sm border-violet-400 px-4 mt-2 hover:no-underline">
              Material Cost Model
            </AccordionTrigger>
            <AccordionContent>
              <MaterialCalculator />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="font-semibold cursor-pointer border py-1 shadow-sm border-violet-400 px-4 mt-2 hover:no-underline">
              Conversion Cost Model
            </AccordionTrigger>
            <AccordionContent>
              <ConversionCostCalculation />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="font-semibold cursor-pointer border py-1 shadow-sm border-violet-400 px-4 mt-2 hover:no-underline">
              Machine Cost Model
            </AccordionTrigger>
            <AccordionContent>
              <MachineCostCalculation />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

    </div>
  )
}
