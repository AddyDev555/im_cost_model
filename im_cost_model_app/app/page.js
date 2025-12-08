import React from 'react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { MaterialCalculator } from './calculation_models/material_cost_calculator';
import SKUDescription from './calculation_models/sku_description';
import ConversionCostCalculation from './calculation_models/conversion_cost_calculation';
import { Plus } from 'lucide-react';

export default function page() {
  return (
    <div>
      {/* <h1 className="text-3xl font-semibold px-4 py-2">IM Cost Model</h1> */}

      <div className="px-4">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="font-semibold cursor-pointer border py-1 shadow-sm  border-violet-400 px-4 mt-2 hover:no-underline">
              SKU Description
            </AccordionTrigger>
            <AccordionContent>
              <SKUDescription />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="font-semibold cursor-pointer border py-1 shadow-sm  border-violet-400 px-4 mt-2 hover:no-underline">
              Material Cost Model
            </AccordionTrigger>
            <AccordionContent>
              <MaterialCalculator />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="font-semibold cursor-pointer border py-1 shadow-sm  border-violet-400 px-4 mt-2 hover:no-underline">
              Conversion Cost Model
            </AccordionTrigger>
            <AccordionContent>
              <ConversionCostCalculation />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

    </div>
  )
}
