from fastapi import APIRouter, Request
from google_sheets_con import open_google_spreadsheet
import requests

router = APIRouter()

APPSCRIPT_URL = "https://script.google.com/macros/s/AKfycby6kdGDrFE_Y45Hl-T2kYHkvKlCaMzp3KU5QqY3lXdW-20P-yqWDOyZeQx0ee-_ORzZ/exec"

# ---------------- UTILITY FUNCTIONS ----------------
def build_label_map(sheet, label_col=1):
    """Returns a dict: { 'Label': row_number }"""
    labels = sheet.col_values(label_col)
    return {label: i+1 for i, label in enumerate(labels) if label}

def get_value(row_map, sheet, label, value_col):
    """Fetch value by label from the sheet"""
    if label not in row_map:
        return None
    row = row_map[label]
    return sheet.cell(row, value_col).value

def get_row_by_label(sheet, label):
    """Return row number for a given label."""
    cell = sheet.find(label)
    return cell.row if cell else None

def set_value_by_label(sheet, label, value, value_col=3):
    """Update the value next to label. Default column C."""
    row = get_row_by_label(sheet, label)
    if row:
        sheet.update_cell(row, value_col, value)

# ---------------- GET SKU INPUTS ----------------
@router.get("/get-sku-inputs")
async def get_sku_data_inputs():
    try:
        spreadsheet = open_google_spreadsheet()
        if not spreadsheet:
            return {"error": "Unable to access the Google Spreadsheet."}

        # Input sheet
        inputs_sheet = spreadsheet.worksheet("input")
        row_map = build_label_map(inputs_sheet)

        data = {
            "sku_desc": get_value(row_map, inputs_sheet, "SKU Description", 3),
            "sku_code": get_value(row_map, inputs_sheet, "SKU Code", 3),
            "sku_country": get_value(row_map, inputs_sheet, "Country", 3),
            "sku_currency": get_value(row_map, inputs_sheet, "Currency", 3),
            "sku_supplier": get_value(row_map, inputs_sheet, "Supplier", 3),
            "costing_period": get_value(row_map, inputs_sheet, "Costing Period", 3),
            "annual_volume": get_value(row_map, inputs_sheet, "Annual Volume ", 3),
            "mould_cavitation": get_value(row_map, inputs_sheet, "Mould Cavitation", 3),
            "mould_cycle_time": get_value(row_map, inputs_sheet, "Mould Cycle Time", 3),
            "machine_model_tonnage": get_value(row_map, inputs_sheet, "Machine Model & Tonnage", 3),
            "no_of_setups_per_year": get_value(row_map, inputs_sheet, "No of Set Up / Year", 3),
            "no_of_ramp_ups_per_year": get_value(row_map, inputs_sheet, "No of Ramp Ups/Year", 3),
        }

        # Summary sheet
        summary_sheet = spreadsheet.worksheet("summary")
        sum_map = build_label_map(summary_sheet)

        for label in ["Material", "Conversion", "Margin", "Packaging", "Freight"]:
            data[label.lower().replace(" ", "_") + "_cost_inr"] = get_value(sum_map, summary_sheet, label, 2)
            data[label.lower().replace(" ", "_") + "_cost_eur"] = get_value(sum_map, summary_sheet, label, 3)
            data[label.lower().replace(" ", "_") + "_cost_per"] = get_value(sum_map, summary_sheet, label, 4)

        return {"success": True, "data": data}

    except Exception as e:
        return {"error": str(e)}


@router.get("/get-sheet-data")
async def get_sku_sheet_data():
    try:
        res = requests.get(APPSCRIPT_URL)
        full = res.json()
        data = full.get('data', {})

        print(full)
        
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
                "material_cost_per": data.get("material_cost_per"),
                "conversion_cost_inr": data.get("conversion_cost_inr"),
                "conversion_cost_eur": data.get("conversion_cost_eur"),
                "conversion_cost_per": data.get("conversion_cost_per"),
                "margin_cost_inr": data.get("margin_inr"),
                "margin_cost_eur": data.get("margin_eur"),
                "margin_cost_per": data.get("margin_per"),
                "packaging_cost_inr": data.get("packaging_inr"),
                "packaging_cost_eur": data.get("packaging_eur"),
                "packaging_cost_per": data.get("packaging_per"),
                "freight_cost_inr": data.get("freight_inr"),
                "freight_cost_eur": data.get("freight_eur"),
                "freight_cost_per": data.get("freight_per")
            }
        }

    except Exception as e:
        return {"error": str(e)}

# ---------------- UPDATE SKU INPUTS ----------------
@router.post("/update-sku-inputs")
async def update_sku_data(request: Request):
    try:
        data = await request.json()
        spreadsheet = open_google_spreadsheet()
        if not spreadsheet:
            return {"error": "Unable to access the Google Spreadsheet."}

        inputs_sheet = spreadsheet.worksheet("input")

        # Mapping frontend fields to sheet labels
        update_map = {
            "SKU Description": data["sku_desc"],
            "SKU Code": data["sku_code"],
            "Country": data["sku_country"],
            "Currency": data["sku_currency"],
            "Supplier": data["sku_supplier"],
            "Costing Period": data["costing_period"],
            "Annual Volume": data["annual_volume"],
            "Mould Cavitation": data["mould_cavitation"],
            "Mould Cycle Time": data["mould_cycle_time"],
            "Machine Model/Tonnage": data["machine_model_tonnage"],
            "No of Setups per Year": data["no_of_setups_per_year"],
            "No of Ramp Ups per Year": data["no_of_ramp_ups_per_year"],
        }

        for label, value in update_map.items():
            set_value_by_label(inputs_sheet, label, value)

        # Re-fetch updated data
        updated_data = await get_sku_data_inputs()
        return {"success": True, "message": "SKU data updated successfully.", "data": updated_data["data"]}

    except Exception as e:
        return {"error": str(e)}
