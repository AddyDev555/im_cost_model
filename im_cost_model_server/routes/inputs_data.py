from fastapi import APIRouter
import requests
import os
from dotenv import load_dotenv

router = APIRouter()
load_dotenv()

APPSCRIPT_URL = os.getenv("APPSCRIPT_GS_URL")

@router.get("/get-inputs-data")
async def get_inputs_data():
    try:
        res = requests.get(APPSCRIPT_URL)
        full = res.json()
        data = full.get('data', {})

        def to_percentage(value):
            """Converts a ratio to a percentage if it's a number, otherwise returns it as is."""
            if value is None or value == '':
                return value
            try:
                return float(value) * 100
            except (ValueError, TypeError):
                return value

        # print(full)
        
        return {
            "success": True,
            "data": {
                "sku_desc": data.get("sku_description"),
                "sku_code": data.get("sku_code"),
                "sku_country": data.get("country"),
                "sku_currency": data.get("currency"),
                "sku_supplier": data.get("supplier"),
                "annual_volume": data.get("annual_volume_pcs"),
                "mould_cavitation": data.get("mould_cavitation_nos"),
                "mould_cycle_time": data.get("mould_cycle_time_secs"),
                "machine_model_tonnage": data.get("machine_model_&_tonnage"),
                "no_of_setups_per_year": data.get("no_of_set_up_/_year_nos"),
                "no_of_ramp_ups_per_year": data.get("no_of_ramp_ups/year_nos"),
                "material_cost_inr": data.get("material_cost_inr"),
                "material_cost_eur": data.get("material_cost_eur"),
                "material_cost_per": to_percentage(data.get("material_cost_per")),
                "conversion_cost_inr": data.get("conversion_cost_inr"),
                "conversion_cost_eur": data.get("conversion_cost_eur"),
                "conversion_cost_per": to_percentage(data.get("conversion_cost_per")),
                "margin_cost_inr": data.get("margin_inr"),
                "margin_cost_eur": data.get("margin_eur"),
                "margin_cost_per": to_percentage(data.get("margin_per")),
                "packaging_cost_inr": data.get("packaging_inr"),
                "packaging_cost_eur": data.get("packaging_eur"),
                "packaging_cost_per": to_percentage(data.get("packaging_per")),
                "freight_cost_inr": data.get("freight_inr"),
                "freight_cost_eur": data.get("freight_eur"),
                "freight_cost_per": to_percentage(data.get("freight_per")),
                "weight_g": data['weight_g'],
                "shot1_ratio_pct": data.get('shot_1_ratio_pct'),
                "shot1_poly_rate": data['shot_1_polymer_rate_inr_per_kg'],
                "shot1_mb_dosage_pct": data.get('shot_1_masterbatch_dosage_pct'),
                "shot1_mb_rate": data['shot_1_masterbatch_rate_inr_per_kg'],
                "shot1_add_dosage_pct": data.get('shot_1_additive_dosage_pct'),
                "shot1_add_rate": data['shot_1_additive_rate'],
                "material_cost": data['material_cost_inr'],
                "material_cost_eur": data['material_cost_eur'],
                "material_cost_per": to_percentage(data.get('material_cost_per')),
                "resin_cost": data['resin_inr'],
                "resin_cost_eur": data['resin_eur'],
                "resin_cost_per": to_percentage(data.get('resin_per')),
                "mb_cost": data['masterbatch_inr'],
                "mb_cost_eur": data['masterbatch_eur'],
                "mb_cost_per": to_percentage(data.get('masterbatch_per')),
                "add_cost": data['additive_inr'],
                "add_cost_eur": data['additive_eur'],
                "add_cost_per": to_percentage(data.get('additive_per')),
                "electricity_rate": data.get("electricity_rate_inr_per_kwh"),
                "skilled_labour_rate": data.get("skilled_labour_inr_per_year"),
                "engineer_rate": data.get("engineer_inr_per_year"),
                "product_manager": data.get("production_manager_inr_per_year"),
                "repair_maintainance": data.get("repair_&_maintainance_machine value"),
                "other_overheads": data.get("other_overheads_machine value"),
                "depreciation_on_plant_machinery": data.get("depreciation_on_plant_&_machinery_pct"),
                "depreciation_on_building": data.get("depreciation_on_building_pct"), 
                "completed_life_of_asset": data.get("completed_life_of_asset_years"),
                "land_cost": data.get("land_cost_inr per sq mtr"),
                "building_investment": data.get("building_investment_₹"),
                "lease_cost": data.get("lease_cost_₹"),
                "type_of_premises": data.get("type_of_premises"),
                "interest_on_long_term_loan": data.get("interest_on_long_term_loan_pct"),
                "interest_on_working_capital": data.get("interest_on_working_capital_pct"),
                "margin": data.get("margin_pct"),
                "margin_calculation": data.get("margin_calculation"),
                "no_of_orders_per_year": data.get("no_of_orders_/_year_nos"),
                "caps_per_box": data.get("caps_per_box_nos"),
                "boxes_per_pallet": data.get("caps_per_box_nos"),
                "pallet_type": data.get("pallet_type"),
                "type_of_container": data.get("type_of_container"),
                "boxes_per_container": data.get("boxes_per_container"),
                "shipper_cost": data.get("shipper_cost_inr"),
                "polybag_cost": data.get("polybag_cost_inr"),
                "packing_cost": data.get("packing_cost_inr"),
                "freight_cost_per_container": data.get("freight_cost_per_container_inr"),
                "days_per_year": data.get("days_per_year"),
                "shifts_per_day": data.get("shifts_per_day"),
                "hours_per_day": data.get("hours_per_day"), 
                "efficiency": data.get("efficiency"),
                "available_hours_per_year": data.get("available_hours_per_year"),
                'conversion_cost_inr': data.get("conversion_cost_inr"),
                'conversion_cost_eur': data.get("conversion_cost_eur"),
                'conversion_cost_per': to_percentage(data.get("conversion_cost_per")),
                'electricity_inr': data.get("electricity_inr"),
                'electricity_eur': data.get("electricity_eur"),
                'electricity_per': to_percentage(data.get("electricity_per")),
                'labour_direct_inr': data.get("labour-direct_inr"),
                'labour_direct_eur': data.get("labour-direct_eur"),
                'labour_direct_per': to_percentage(data.get("labour-direct_per")),
                'labour_indirect_inr': data.get("labour-indirect_inr"),
                'labour_indirect_eur': data.get("labour-indirect_eur"),
                'labour_indirect_per': to_percentage(data.get("labour-indirect_per")),
                'repair_maintenance_inr': data.get("repair_&_maintenance_inr"),
                'repair_maintenance_eur': data.get("repair_&_maintenance_eur"),
                'repair_maintenance_per': to_percentage(data.get("repair_&_maintenance_per")),
                'overheads_inr': data.get("other_overheads_inr"),
                'overheads_eur': data.get("other_overheads_eur"),
                'overheads_per': to_percentage(data.get("other_overheads_per")),
                'lease_cost_inr': data.get("lease_inr"),
                'lease_cost_eur': data.get("lease_eur"),
                'lease_cost_per': to_percentage(data.get("lease_per")),
                'depreciation_inr': data.get("depreciation_inr"),
                'depreciation_eur': data.get("depreciation_eur"),
                'depreciation_per': to_percentage(data.get("depreciation_per")),
                'interest_inr': data.get("interest_inr"),
                'interest_eur': data.get("interest_eur"),
                'interest_per': to_percentage(data.get("interest_per")),
                'margin_inr': data.get("margin_inr"),
                'margin_eur': data.get("margin_eur"),
                'margin_per': to_percentage(data.get("margin_per")),
                'distribution_inr': data.get("distribution_inr"),
                'distribution_eur': data.get("distribution_eur"),
                'distribution_per': to_percentage(data.get("distribution_per")),
                'packgaging_inr': data.get("packgaging_inr"),
                'packgaging_eur': data.get("packgaging_eur"),
                'packgaging_per': to_percentage(data.get("packgaging_per")),
                'freight_inr': data.get("freight_inr"),
                'freight_eur': data.get("freight_eur"),
                'freight_per': to_percentage(data.get("freight_per")),
                'total_inr': data.get("total_inr"),
                "total_eur": data.get("total_eur"),
                "total_per": to_percentage(data.get("total_per"))
            }
        }

    except Exception as e:
        return {"error": str(e)}