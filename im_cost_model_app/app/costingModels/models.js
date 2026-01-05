export const IMCostModelMapper = {
    sku_description: {
        sku_description: "Product",
        sku_code: "SKU Code",
        country: "Country",
        currency_symbol: "Currency",
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
        shot_1_polymer_grade: "Polymer Grade",
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
        "machine_model_&_tonnage": "Machine Model & Tonnage",
        "no_of_set_up_/_year": "No of Set Up / Year",
        "no_of_ramp_ups/year": "No of Ramp Up / Year",

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
        primer_rate: "Primer Rate",
        board_rate: "Board Rate",
        ink_rate: "Ink Rate",
        varnish_rate: "Varnish Rate",
        foil_rate: "Foil Rate",
        film_rate: "File Rate",
        primer_rate: "Primer Rate",
        no_of_colours: "No of Colours",
        common_colours: "Common Colours",
        no_of_designs: "No of Designs",
        "no_of_print_runs_/_year": "No of Print Runs / year",
        "no_of_designs/run": "No of Designs/Run",
        length_1: "Length 1",
        length_2: "Length 2",
        width_1: "Width 1",
        width_2: "Width 2",
        height: "Height",
        max_flap: "Max Flap",
        gluing_area: "Gluing Area",
        machine_size: "Machine Size",
        grain_direction: "Grain Direction",
        board_type: "Board Type",
        board_gsm: "Board GSM",
        interlock: "Interlock",
        interlock_value: "Interlock Value",

        // Decoration
        spot_varnish: "Spot Varnish",
        hot_foiling: "Hot Foiling",
        lamination: "Lamination",
        window_carton: "Window Carton",

        // Decoration Details
        varnish_type: "Varnish Type",
        spot_varnish_type: "Spot Varnish Type",
        "spot_varnish_area_(%_of_total_sqm)": "Spot Varnish Area (% of Total SQM)",
        foil_length: "Foil Length",
        foil_width: "Foil Width",
        film_type: "Film Type",
        film_micron: "Film micron",
        film_gsm: "Film GSM",
        primer: "Primer",
        "window_-_width": "Window - Width",
        "window_-_length": "Window - Length",
        window_film_micron: "Window Film micron",
        window_film_gsm: "Window Film GSM"
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
        printing_machine: "Printing Machine",
        spot_varnish_machine: "Spot Varnish Machine",
        hot_foiling_machine: "Hot Foiling Machine",
        lamination_machine: "Lamination Machine",
        creasing_and_blanking_machine: "Creasing & Blanking Machine",
        "folder_-_gluer_machine": "Folder - Gluer Machine",
        window_patching_machine: "Window Patching Machine",

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
        "180": "180",
        length: "Length",
        width: "Width",
        height: "Height",

        no_of_ply: "No of Ply",
        flute_1: "Flute 1",
        flute_2: "Flute 2",

        construction: "Construction",
        k1: "K1",
        k1_type: "K1 Type",
        m1: "M1",
        m1_type: "M1 Type",
        k2: "K2",
        k2_type: "K2 Type",
        m2: "M2",
        m2_type: "M2 Type",
        k3: "K3",
        k3_type: "K3 Type",

        outer_dimensions_add_length: "Add Length",
        outer_dimensions_add_width: "Add Width",

        printing_method: "Printing Method",
        no_of_colours: "No of Colours",
        type_of_die_cutting: "Type of Die Cutting"
    },
    material_summary: {
        paper: "Paper",
        "material_cost": "Total"
    },
    conversion_inputs: {
        corrugation_line: "Corrugation Line",
        printing_machine: "Printing Machine",
        rotary_die_cutter: "Rotary Die Cutter",
        flat_bed_die_cutter: "Flat Bed Die Cutter",
        "former_&_gluer": "Former & Gluer",
        "no_of_set_ups/year": "No of Set Ups/Year",
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
        layer_1_polymer_type: "Polymer Type",
        layer_1_polymer_grade: "Polymer Grade",
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
        "machine_model_&_tonnage": "Machine Model & Tonnage",
        "no_of_set_up_/_year": "No of Set Up / Year",
        "no_of_ramp_ups/year": "No of Ramp Ups/Year",
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
        layer_1_polymer_type: "Polymer Type",
        layer_1_polymer_grade: "Polymer Grade",
        layer_1_polymer_rate: "Polymer Rate",
        layer_1_masterbatch_dosage: "Masterbatch Dosage",
        layer_1_masterbatch_rate: "Masterbatch Rate",
        layer_1_uv_additive_dosage: "Additive Dosage",
        layer_1_uv_additive_rate: "Additive Rate",
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
        "machine_model_&_tonnage": "Machine Model & Tonnage",
        "no_of_set_up_/_year": "No of Set Up / Year",
        "no_of_ramp_ups/year": "No of Ramp Ups/Year",
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
        layer_1_polymer_type: "Polymer Type",
        layer_1_polymer_grade: "Polymer Grade",
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

export const TubeCostModelMapper = {
    sku_description: {
        product: "Product",
        sku_code: "SKU Code",
        country: "Country",
        currency_symbol: "Currency",
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
        tubing: "Tubing",
        shoulder: "Shoulder",
        cap: "Cap",
        printing: "Printing",
        dispatch: "Dispatch"
    },
    material_inputs: {
        cap_resin: "Cap Resin",
        pp: "PP",
        shoulder_resin: "Shoulder Resin",
        hdpe_2308: "HDPE 2308",
        masterbatch_rate: "Masterbatch Rate",
        additives: "Additives",
        tube_dia: "Dia",
        tube_length: "Tube Length",
        laminate_specs: "Laminate Specs",
        laminate_cost: "Laminate Cost",
        cap_type: "Cap Type",
        cap_weight: "Cap Weight",
        cap_mould_cavitation: "Cap Mould Cavitation",
        cap_cycle_time: "Cap Cycle Time",
        cap_polymer_dosage: "Cap Polymer Dosage",
        cap_masterbatch: "Cap Masterbatch",
        cap_additive: "Cap Additive",
        shoulder_weight: "Shoulder Weight",
        shoulder_mould_cavitation: "Shoulder Mould Cavitation",
        shoulder_cycle_time: "Shoulder Cycle Time",
        shoulder_polymer_dosage: "Shoulder Polymer Dosage",
        shoulder_masterbatch: "Shoulder Masterbatch",
        shoulder_additive: "Shoulder Additive"
    },
    material_summary: {
        web_cost: "Web Cost",
        ink: "Ink",
        shoulder_cost: "Shoulder Cost",
        cap_cost: "Cap Cost",
        material_cost: "Total"
    },

    conversion_inputs: {
        cap_machine_model_tonnage: "Cap Machine Model & Tonnage",
        shoulder_machine_model_tonnage: "Shoulder Machine Model & Tonnage",
        tubing_machine_option: "Tubing Machine Option",
        tube_machine_model: "Tube Machine Model",
        print_model: "Print Model",
        annual_volume: "Annual Volume",
        electricity_rate: "Electricity Rate",
        unskilled_labour: "Unskilled Labour",
        skilled_labour: "Skilled Labour",
        engineer: "Engineer",
        production_manager: "Production Manager",
        repair_maintenance: "Repair & Maintainance",
        other_overheads: "Other Overheads",
        depreciation_on_pm: "Depreciation on P&M",
        completed_life_of_asset: "Completed Life of Asset",
        depreciation_on_building: "Depreciation on Building",
        land_cost: "Land Cost",
        building_cost: "Building Cost",
        lease_cost: "Lease Cost",
        type_of_premises: "Type of Premises",
        interest_on_long_term_loan: "Interest on Long Term Loan",
        interest_on_working_capital: "Interest on Working Capital",
        margin: "Margin",
        tubes_per_box: "Tubes Per Box",
        boxes_per_pallet: "Boxes Per Pallet",
        boxes_per_container: "Boxes Per Container",
        shipper_cost: "Shipper Cost",
        polybag_cost: "Polybag Cost",
        pallet_cost: "Pallet Cost",
        container_type: "Container Type",
        weight_per_container: "Weight per container",
        freight_cost_per_container: "Freight cost per container",
        delivery_cost: "Delivery Cost",
        pallet_type: "Pallet Type",
        cap_freight: "Cap Freight",
        cap_container_load: "Cap Container load",
        cap_freight_cost: "Cap Freight cost",
        euro_rate: "Euro",
        usd_rate: "USD",
        payment_terms_rm: "RM",
        payment_terms_fg: "FG",
        rm_inventory_holding: "RM Inventory Holding",
        fg_inventory_holding: "FG Inventory Holding"
    },

    conversion_summary: {
        conversion_cost: "Total",
        depreciation: "Depreciation",
        interest_on_long_term_loan: "Interest on Long Term Loan",
        "labour-direct": "Labour-direct",
        "labour-indirect": "Labour-Indirect",
        lease: "Lease",
        "repair_&_maintenance": "Repair & Maintenance",
        other_overheads: "Other Overheads",
        working_capital_cost: "Working Capital Cost",
        power: "Power",
        depreciation: "Depreciation",
        interest_on_long_term_loan: "Interest on Long Term Loan",
        "labour-direct": "Labour-direct",
        "repair_&_maintenance": "Repair & Maintenance",
        other_overheads: "Other Overheads",
        power: "Power",
        flexo_plate_cost: "Flexo Plate Cost",
        depreciation: "Depreciation",
        interest_on_long_term_loan: "Interest on Long Term Loan",
        "labour-direct": "Labour-direct",
        "labour-indirect": "Labour-indirect",
        "repair_&_maintenance": "Repair & Maintenance",
        other_overheads: "Other Overheads",
        power: "Power",
        margin: "Margin",
        packaging: "Packaging",
        freight: "Freight"
    }
}