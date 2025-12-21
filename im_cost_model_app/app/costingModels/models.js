export const IMCostModelMapper = {
    sku_description: {
        sku_description: "Product",
        sku_code: "SKU Code",
        country: "Country",
        currency: "Currency",
        supplier: "Supplier",
    },
    general_summary: {
        material_cost: "Material",
        conversion_cost: "Conversion",
        margin: "Margin",
        packaging: "Packaging",
        freight: "Freight",
        total: "Total",
    },
    process_summary: {
        feedstock: "Feedstock",
        injection: "Injection",
        assembly: "Assembly",
        dispatch: "Dispatch",
        total: "Total",
    },
    material_inputs: {
        weight: "Weight",
        shot_1_ratio: "Ratio",
        shot_1_polymer_type: "Polymer Type",
        shot_1_polymer_rate: "Polymer Rate",
        shot_1_masterbatch_dosage: "Masterbatch Dosage",
        shot_1_masterbatch_rate: "Masterbatch Rate",
        shot_1_additive_dosage: "Additive Dosage",
        shot_1_additive_rate: "Additive Rate"
    },
    material_summary: {
        resin: "Resin",
        masterbatch: "Masterbatch",
        additive: "Additive",
        material_cost: "Total"
    },

    conversion_inputs: {
        "mould_cavitation": "Mould Cavitation",
        "mould_cycle_time": "Mould Cycle Time",
        "annual_volume": "Annual Volume",

        "electricity_rate": "Electricity Rate",

        "skilled_labour": "Skilled Labour",
        "engineer": "Engineer",
        "production_manager": "Production Manager",

        "repair_&_maintainance": "Repair & Maintainance",
        "other_overheads": "Other Overheads",

        "depreciation_on_plant_&_machinery": "Depreciation on Plant & Machinery",
        "depreciation_on_building": "Depreciation on Building",
        "completed_life_of_asset": "Completed life of asset",

        "land_cost": "Land Cost",
        "building_investment": "Building Investment",
        "lease_cost": "Lease Cost",
        "type_of_premises": "Type of Premises",

        "interest_on_long_term_loan": "Interest on Long Term Loan",
        "interest_on_working_capital": "Interest on Working Capital",
        "margin": "Margin",
        "margin_calculation": "Margin Calculation",

        "no_of_orders_/_year": "No of Orders / Year",

        "caps_per_box": "Caps Per Box",
        "pallet_type": "Pallet Type",
        "type_of_container": "Type of Container",
        "boxes_per_container": "Boxes Per Container",
        "shipper_cost": "Shipper Cost",
        "polybag_cost": "Polybag Cost",
        "packing_cost": "Packing Cost",
        "freight_cost_per_container": "Freight cost per container",

        "days_per_year": "Days per Year",
        "shifts_per_day": "Shifts per Day",
        "hours_per_day": "Hours per Day",
        "efficiency": "Efficiency",
        "available_hours_per_year": "Available hours per year",

        "eur_to_inr": "EUR to INR",
        "usd_to_inr": "USD to INR",

        "rm_payment_term": "RM Payment term",
        "fg_payment_term": "FG Payment term"
    },

    conversion_summary: {
        conversion_cost: "Total",
        electricity: "Electricity",
        "labour-direct": "Labour-Direct",
        "labour-indirect": "Labour-Indirect",
        "repair_&_maintenance": "Repair & Maintenance",
        other_overheads: "Other Overheads",
        lease: "Lease",
        depreciation: "Depreciation",
        interest: "Interest",
        margin: "Margin",
        distribution: "Distribution",
        packgaging: "Packgaging",
        freight: "Freight"
    }
}

export const CartonCostModel = {
    sku_description: {
        product: "Product",
        sku_code: "SKU Code",
        country: "Country",
        currency_symbol: "Currency",
        supplier: "Supplier",
    },
    general_summary: {
        material_cost: "Material",
        conversion_cost: "Conversion",
        margin: "Margin",
        packaging: "Packaging",
        freight: "Freight",
        total: "Total",
    },
    process_summary: {
        feedstock: "Feedstock",
        printing: "Printing",
        "folding_&_gluing": "Folding & Gluing",
        lamination: "Lamination",
        "foil_stamping_&_other_decoration": "Foil Stamping & other decoration",
        dispatch: "Dispatch",
        total_cost: "Total",
    },
    material_inputs: {
        board_rate: "Board Rate",
        ink_rate: "Ink Rate",
        varnish_rate: "Varnish Rate",
        foil_rate: "Foil Rate",
        film_rate: "Film Rate",
        primer_rate: "Primer Rate"
    },
    material_summary: {
        "300": "300",
        "ink": "Ink",
        "UV_varnish_(gloss)": "UV varnish (Gloss)",
        "hot_foil": "Additive",
        "window_carton": "Window Carton",
        "primer": "Primer",
        "met_pet_film_12_micron": "Met Pet Film 12 micron",
        "other_costs": "Other Costs",
        "wastage": "Wastage",
        "material_cost": "Total"
    },
    conversion_inputs: {
        electricity: "Electricity",

        manpower_cost: "Manpower Cost",
        skilled_labour: "Skilled Labour",
        engineer: "Engineer",
        production_manager: "Production Manager",
        no_of_shifts: "No of Shifts",

        overheads: "Overheads",
        "repair_&_maintenance": "Repair & Maintenance",
        other_overheads: "Other Overheads",

        depreciation_assumption: "Depreciation Assumption",
        depreciation: "Depreciation",
        completed_life_of_asset: "Completed Life of Asset",
        depreciation_on_building: "Depreciation on Building",

        premises: "Premises",
        land_cost: "Land Cost",
        building_cost: "Building Cost",
        lease_cost: "Lease Cost",
        type_of_premises: "Type of Premises",

        financials: "Financials",
        interest_on_long_term_loan: "Interest on Long Term Loan",
        interest_on_working_capital: "Interest on Working Capital",
        margin: "Margin",
        "lt_debt_-_equity_ratio": "LT Debt - Equity Ratio",

        packing: "Packing",
        cartons_per_box: "Cartons Per Box",
        boxes_per_pallet: "Boxes Per Pallet",
        boxes_per_container: "Boxes Per Container",

        logistics: "Logistics",
        container_type: "Container Type",
        weight_per_container: "Weight per container",
        freight_cost: "Freight Cost",

        exchange_rates: "Exchange Rates",
        euro: "Euro",
        usd: "USD",

        payment_terms: "Payment Terms",
        rm: "RM",
        fg: "FG",

        inventory_holding: "Inventory Holding",
        rm_inventory_holding: "RM Inventory Holding",
        fg_inventory_holding: "FG Inventory Holding",
    },
    conversion_summary: {
        electricity: "Electricity",
        "labour-direct": "Labour-Direct",
        "labour-indirect": "Labour-Indirect",
        "repair_&_maintenance": "Repair & Maintenance",
        other_overheads: "Other Overheads",
        lease: "Lease",
        depreciation: "Depreciation",
        interest: "Interest",
        margin: "Margin",
        distribution: "Distribution",
        packaging: "Packaging",
        freight: "Freight",
        conversion_cost: "Total"
    }
}

export const CorrugateCostModel = {
    sku_description: {
        sku_description: "Product",
        sku_code: "SKU Code",
        country: "Country",
        currency_symbol: "Currency",
        supplier: "Supplier",
    },
    general_summary: {
        material_cost: "Material",
        conversion_cost: "Conversion",
        margin: "Margin",
        packaging: "Packaging",
        freight: "Freight",
        total: "Total",
    },
    process_summary: {
        feedstock: "Feedstock",
        dispatch: "Dispatch",
        corrugating: "Corrugating",
        total_cost: "Total",
    },
    material_inputs: {
        paper_rate: "Paper Rate",
        "115": "115",
        "180": "180"
    },
    material_summary: {
        paper: "Paper",
        "material_cost": "Total"
    },
    conversion_inputs: {
        "electricity_rate": "Electricity Rate",

        "manpower_cost": "Manpower Cost",
        "skilled_labour": "Skilled Labour",
        "engineer": "Engineer",
        "production_manager": "Production Manager",

        "overheads": "Overheads",
        "repair_&_maintainance": "Repair & Maintainance",
        "other_overheads": "Other Overheads",

        "depreciation": "Depreciation",
        "depreciation_on_p_&_m": "Depreciation on P&M",
        "depreciation_on_building": "Depreciation on Building",
        "completed_life_of_asset": "Completed life of asset",

        "premises": "Premises",
        "land_cost": "Land Cost",
        "building_cost": "Building Cost",
        "lease_cost": "Lease Cost",
        "type_of_premises": "Type of Premises",

        "financials": "Financials",
        "interest_on_long_term_loan": "Interest on Long Term Loan",
        "interest_on_working_capital": "Interest on Working Capital",
        "margin": "Margin",
        "margin_calculation": "Margin Calculation",

        "packing": "Packing",
        "strapping_&_shrink_per_bundle": "Strapping & Shrink per Bundle",
        "boxes_per_pallet": "Boxes Per Pallet",
        "boxes_per_container": "Boxes Per Container",

        "logistics": "Logistics",
        "pallet_type": "Pallet Type",
        "type_of_container": "Type of Container",
        "freight_cost_per_container": "Freight cost per container",

        "days_per_year": "Days per Year",
        "shifts_per_day": "Shifts per Day",
        "hours_per_day": "Hours per Day",
        "efficiency": "Efficiency",
        "available_hours_per_year": "Available hours per year",

        "exchange_rates": "Exchange Rates",
        "euro": "Euro",
        "usd": "USD",

        "inventory_holding": "Inventory Holding",
        "rm_inventory_holding": "RM Inventory Holding",
        "fg_inventory_holding": "FG Inventory Holding",

        "payment_terms": "Payment Terms",
        "rm_payment_term": "RM Payment term",
        "fg_payment_term": "FG Payment term"
    },
    conversion_summary: {
        "conversion_cost": "Total",

        "electricity": "Electricity",
        "labour_direct": "Labour-Direct",
        "labour_indirect": "Labour-Indirect",
        "repair_&_maintenance": "Repair & Maintenance",
        "other_overheads": "Other Overheads",
        "lease": "Lease",
        "depreciation": "Depreciation",
        "interest": "Interest",

        "margin": "Margin",

        "distribution": "Distribution",
        "packaging": "Packaging",
        "freight": "Freight"
    },
}

export const RigidEBMCostModel = {
    sku_description: {
        sku_description: "Product",
        sku_code: "SKU Code",
        country: "Country",
        currency_symbol: "Currency",
        supplier: "Supplier",
    },
    general_summary: {
        material_cost: "Material",
        conversion_cost: "Conversion",
        margin: "Margin",
        packaging: "Packaging",
        freight: "Freight",
        total: "Total",
    },
    process_summary: {
        feedstock: "Feedstock",
        injection: "Injection",
        assembly: "Assembly",
        dispatch: "Dispatch",
        total: "Total",
    },
    material_inputs: {
        weight: "Weight",
        layer_1_ratio: "Ratio",
        layer_1_polymer_rate: "Polymer Rate",
        layer_1_masterbatch_dosage: "Masterbatch Dosage",
        layer_1_masterbatch_rate: "Masterbatch Rate",
        layer_1_additive_dosage: "Additive Dosage",
        layer_1_additive_rate: "Additive Rate"
    },
    material_summary: {
        resin: "Resin",
        masterbatch: "Masterbatch",
        additive: "Additive",
        material_cost: "Total"
    },

    conversion_inputs: {
        "mould_cavitation": "Mould Cavitation",
        "mould_cycle_time": "Mould Cycle Time",
        "annual_volume": "Annual Volume",

        "electricity_rate": "Electricity Rate",

        "skilled_labour": "Skilled Labour",
        "engineer": "Engineer",
        "production_manager": "Production Manager",

        "repair_&_maintainance": "Repair & Maintainance",
        "other_overheads": "Other Overheads",

        "depreciation_on_plant_&_machinery": "Depreciation on Plant & Machinery",
        "depreciation_on_building": "Depreciation on Building",
        "completed_life_of_asset": "Completed life of asset",

        "land_cost": "Land Cost",
        "building_investment": "Building Investment",
        "lease_cost": "Lease Cost",
        "type_of_premises": "Type of Premises",

        "interest_on_long_term_loan": "Interest on Long Term Loan",
        "interest_on_working_capital": "Interest on Working Capital",
        "margin": "Margin",
        "margin_calculation": "Margin Calculation",

        "no_of_orders_/_year": "No of Orders / Year",

        "caps_per_box": "Caps Per Box",
        "pallet_type": "Pallet Type",
        "type_of_container": "Type of Container",
        "boxes_per_container": "Boxes Per Container",
        "shipper_cost": "Shipper Cost",
        "polybag_cost": "Polybag Cost",
        "packing_cost": "Packing Cost",
        "freight_cost_per_container": "Freight cost per container",

        "days_per_year": "Days per Year",
        "shifts_per_day": "Shifts per Day",
        "hours_per_day": "Hours per Day",
        "efficiency": "Efficiency",
        "available_hours_per_year": "Available hours per year",

        "eur_to_inr": "EUR to INR",
        "usd_to_inr": "USD to INR",

        "rm_payment_term": "RM Payment term",
        "fg_payment_term": "FG Payment term"
    },

    conversion_summary: {
        conversion_cost: "Total",
        electricity: "Electricity",
        "labour-direct": "Labour-Direct",
        "labour-indirect": "Labour-Indirect",
        "repair_&_maintenance": "Repair & Maintenance",
        other_overheads: "Other Overheads",
        lease: "Lease",
        depreciation: "Depreciation",
        interest: "Interest",
        margin: "Margin",
        distribution: "Distribution",
        packgaging: "Packgaging",
        freight: "Freight"
    }
}

export const RigidISBM1CostModel = {
    sku_description: {
        sku_description: "Product",
        sku_code: "SKU Code",
        country: "Country",
        currency_symbol: "Currency",
        supplier: "Supplier",
    },
    general_summary: {
        material_cost: "Material",
        conversion_cost: "Conversion",
        margin: "Margin",
        packaging: "Packaging",
        freight: "Freight",
        total: "Total",
    },
    process_summary: {
        feedstock: "Feedstock",
        injection: "Injection",
        assembly: "Assembly",
        dispatch: "Dispatch",
        total: "Total",
    },
    material_inputs: {
        weight: "Weight",
        layer_1_ratio: "Ratio",
        layer_1_polymer_rate: "Polymer Rate",
        layer_1_masterbatch_dosage: "Masterbatch Dosage",
        layer_1_masterbatch_rate: "Masterbatch Rate",
        layer_1_uv_additive_dosage: "Additive Dosage",
        layer_1_uv_additive_rate: "Additive Rate"
    },
    material_summary: {
        resin: "Resin",
        masterbatch: "Masterbatch",
        uv_additives: "Additive",
        "anti-scratch_coating": "Anti-Scratch Coating",
        material_cost: "Total"
    },

    conversion_inputs: {
        "mould_cavitation": "Mould Cavitation",
        "mould_cycle_time": "Mould Cycle Time",
        "annual_volume": "Annual Volume",

        "electricity_rate": "Electricity Rate",

        "skilled_labour": "Skilled Labour",
        "engineer": "Engineer",
        "production_manager": "Production Manager",

        "repair_&_maintainance": "Repair & Maintainance",
        "other_overheads": "Other Overheads",

        "depreciation_on_plant_&_machinery": "Depreciation on Plant & Machinery",
        "depreciation_on_building": "Depreciation on Building",
        "completed_life_of_asset": "Completed life of asset",

        "land_cost": "Land Cost",
        "building_investment": "Building Investment",
        "lease_cost": "Lease Cost",
        "type_of_premises": "Type of Premises",

        "interest_on_long_term_loan": "Interest on Long Term Loan",
        "interest_on_working_capital": "Interest on Working Capital",
        "margin": "Margin",
        "margin_calculation": "Margin Calculation",

        "no_of_orders_/_year": "No of Orders / Year",

        "caps_per_box": "Caps Per Box",
        "pallet_type": "Pallet Type",
        "type_of_container": "Type of Container",
        "boxes_per_container": "Boxes Per Container",
        "shipper_cost": "Shipper Cost",
        "polybag_cost": "Polybag Cost",
        "packing_cost": "Packing Cost",
        "freight_cost_per_container": "Freight cost per container",

        "days_per_year": "Days per Year",
        "shifts_per_day": "Shifts per Day",
        "hours_per_day": "Hours per Day",
        "efficiency": "Efficiency",
        "available_hours_per_year": "Available hours per year",

        "eur_to_inr": "EUR to INR",
        "usd_to_inr": "USD to INR",

        "rm_payment_term": "RM Payment term",
        "fg_payment_term": "FG Payment term"
    },

    conversion_summary: {
        conversion_cost: "Total",
        electricity: "Electricity",
        "labour-direct": "Labour-Direct",
        "labour-indirect": "Labour-Indirect",
        "repair_&_maintenance": "Repair & Maintenance",
        other_overheads: "Other Overheads",
        lease: "Lease",
        depreciation: "Depreciation",
        interest: "Interest",
        margin: "Margin",
        distribution: "Distribution",
        packgaging: "Packgaging",
        freight: "Freight"
    }
}

export const RigidISBM2CostModel = {
    sku_description: {
        sku_description: "Product",
        sku_code: "SKU Code",
        country: "Country",
        currency_symbol: "Currency",
        supplier: "Supplier",
    },
    general_summary: {
        material_cost: "Material",
        conversion_cost: "Conversion",
        margin: "Margin",
        packaging: "Packaging",
        freight: "Freight",
        total: "Total",
    },
    process_summary: {
        feedstock: "Feedstock",
        injection: "Injection",
        assembly: "Assembly",
        dispatch: "Dispatch",
        total: "Total",
    },
    material_inputs: {
        weight: "Weight",
        layer_1_ratio: "Ratio",
        layer_1_polymer_rate: "Polymer Rate",
        layer_1_masterbatch_dosage: "Masterbatch Dosage",
        layer_1_masterbatch_rate: "Masterbatch Rate",
        layer_1_uv_additive_dosage: "Additive Dosage",
        layer_1_uv_additive_rate: "Additive Rate"
    },
    material_summary: {
        resin: "Resin",
        masterbatch: "Masterbatch",
        uv_additives: "Additive",
        "anti-scratch_coating": "Anti-Scratch Coating",
        material_cost: "Total"
    },

    conversion_inputs: {
        "mould_cavitation": "Mould Cavitation",
        "mould_cycle_time": "Mould Cycle Time",
        "annual_volume": "Annual Volume",

        "electricity_rate": "Electricity Rate",

        "skilled_labour": "Skilled Labour",
        "engineer": "Engineer",
        "production_manager": "Production Manager",

        "repair_&_maintainance": "Repair & Maintainance",
        "other_overheads": "Other Overheads",

        "depreciation_on_plant_&_machinery": "Depreciation on Plant & Machinery",
        "depreciation_on_building": "Depreciation on Building",
        "completed_life_of_asset": "Completed life of asset",

        "land_cost": "Land Cost",
        "building_investment": "Building Investment",
        "lease_cost": "Lease Cost",
        "type_of_premises": "Type of Premises",

        "interest_on_long_term_loan": "Interest on Long Term Loan",
        "interest_on_working_capital": "Interest on Working Capital",
        "margin": "Margin",
        "margin_calculation": "Margin Calculation",

        "no_of_orders_/_year": "No of Orders / Year",

        "caps_per_box": "Caps Per Box",
        "pallet_type": "Pallet Type",
        "type_of_container": "Type of Container",
        "boxes_per_container": "Boxes Per Container",
        "shipper_cost": "Shipper Cost",
        "polybag_cost": "Polybag Cost",
        "packing_cost": "Packing Cost",
        "freight_cost_per_container": "Freight cost per container",

        "days_per_year": "Days per Year",
        "shifts_per_day": "Shifts per Day",
        "hours_per_day": "Hours per Day",
        "efficiency": "Efficiency",
        "available_hours_per_year": "Available hours per year",

        "eur_to_inr": "EUR to INR",
        "usd_to_inr": "USD to INR",

        "rm_payment_term": "RM Payment term",
        "fg_payment_term": "FG Payment term"
    },

    conversion_summary: {
        conversion_cost: "Total",
        electricity: "Electricity",
        "labour-direct": "Labour-Direct",
        "labour-indirect": "Labour-Indirect",
        "repair_&_maintenance": "Repair & Maintenance",
        other_overheads: "Other Overheads",
        lease: "Lease",
        depreciation: "Depreciation",
        interest: "Interest",
        margin: "Margin",
        distribution: "Distribution",
        packgaging: "Packgaging",
        freight: "Freight"
    }
} 