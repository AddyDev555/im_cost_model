from fastapi import APIRouter, Request
from google_sheets_con import open_google_spreadsheet
from scrapper.api_call import get_more_price
from scrapper.scrap import get_html, extract_html_table
import requests

router = APIRouter()

APPSCRIPT_URL = "https://script.google.com/macros/s/AKfycby6kdGDrFE_Y45Hl-T2kYHkvKlCaMzp3KU5QqY3lXdW-20P-yqWDOyZeQx0ee-_ORzZ/exec"
APPSCRIPT_URL_POST = "https://script.google.com/macros/s/AKfycbztquh6ZLnSyuEg79lugUr7mHh3YEVsNOG6vZ7H-xvbZZ1cET0kTgbUElPIvmpYzo-jIw/exec"

def build_label_map(sheet, label_col=1):
    """
    Returns a dict: { 'Label': row_number }
    Scans the sheet once → much faster.
    """
    labels = sheet.col_values(label_col)
    return {label: i+1 for i, label in enumerate(labels) if label}


def get_value(row_map, sheet, label, value_col):
    if label not in row_map:
        return None
    row = row_map[label]
    return sheet.cell(row, value_col).value

def get_three_values(rows, label):
    for row in rows:
        if row[0].strip() == label:
            return {
                "inr": row[1],
                "eur": row[2],
                "percent": row[3]
            }
    return {"inr": None, "eur": None, "percent": None}

def get_row_by_label(sheet, label):
    """Return row number for a given label."""
    cell = sheet.find(label)
    return cell.row if cell else None

def set_value_by_label(sheet, label, value, value_col=3):
    """Update the value next to label. Default column C."""
    row = get_row_by_label(sheet, label)
    if row:
        sheet.update_cell(row, value_col, value)

@router.get("/get-inputs")
async def get_material_cost_inputs():
    try:
        spreadsheet = open_google_spreadsheet()
        if not spreadsheet:
            return {"error": "Unable to access the Google Spreadsheet."}

        sheet = spreadsheet.worksheet("input")

        # Build map (fast)
        row_map = build_label_map(sheet)

        data = {
            'weight_g': get_value(row_map, sheet, "Weight", 3),
            'shot1_ratio_pct': get_value(row_map, sheet, "Shot 1 Ratio", 3),
            'shot1_poly_rate': get_value(row_map, sheet, "Shot 1 Polymer Rate", 3),
            'shot1_mb_dosage_pct': get_value(row_map, sheet, "Shot 1 Masterbatch Dosage", 3),
            'shot1_mb_rate': get_value(row_map, sheet, "Shot 1 Masterbatch Rate", 3),
            'shot1_add_dosage_pct': get_value(row_map, sheet, "Shot 1 Additive Dosage", 3),
            'shot1_add_rate': get_value(row_map, sheet, "Shot 1 Additive Rate", 3),
        }

        # SUMMARY sheet (Material cost)
        summary = spreadsheet.worksheet("summary")
        sum_map = build_label_map(summary)

        data.update({
            # Resin
            'resin_cost': get_value(sum_map, summary, "Resin", 2),
            'resin_cost_eur': get_value(sum_map, summary, "Resin", 3),
            'resin_cost_per': get_value(sum_map, summary, "Resin", 4),

            # Masterbatch
            'mb_cost': get_value(sum_map, summary, "Masterbatch", 2),
            'mb_cost_eur': get_value(sum_map, summary, "Masterbatch", 3),
            'mb_cost_per': get_value(sum_map, summary, "Masterbatch", 4),

            # Additive
            'add_cost': get_value(sum_map, summary, "Additive", 2),
            'add_cost_eur': get_value(sum_map, summary, "Additive", 3),
            'add_cost_per': get_value(sum_map, summary, "Additive", 4),

            # Material Cost Header
            'material_cost': get_value(sum_map, summary, "Material Cost", 2),
            'material_cost_eur': get_value(sum_map, summary, "Material Cost", 3),
            'material_cost_per': get_value(sum_map, summary, "Material Cost", 4),
        })

        return {"success": True, "data": data}

    except Exception as e:
        return {"error": str(e)}


@router.post("/calculator")
async def material_cost_calculator(request: Request):
    try:
        data = await request.json()

        spreadsheet = open_google_spreadsheet()
        if not spreadsheet:
            return {"error": "Unable to access the Google Spreadsheet."}

        inputs_sheet = spreadsheet.worksheet("input")

        # ----------- UPDATE INPUTS USING LABELS -----------
        update_map = {
            "Weight": data["weight_g"],
            "Shot 1 Ratio": data["shot1_ratio_pct"],
            "Shot 1 Polymer Rate": data["shot1_poly_rate"],
            "Shot 1 Masterbatch Dosage": data["shot1_mb_dosage_pct"],
            "Shot 1 Masterbatch Rate": data["shot1_mb_rate"],
            "Shot 1 Additive Dosage": data["shot1_add_dosage_pct"],
            "Shot 1 Additive Rate": data["shot1_add_rate"],

            "Shot 2 Ratio": data["shot2_ratio_pct"],
            "Shot 2 Polymer Rate": data["shot2_poly_rate"],
            "Shot 2 Masterbatch Dosage": data["shot2_mb_dosage_pct"],
            "Shot 2 Masterbatch Rate": data["shot2_mb_rate"],
            "Shot 2 Additive Dosage": data["shot2_add_dosage_pct"],
            "Shot 2 Additive Rate": data["shot2_add_rate"],
        }

        for label, value in update_map.items():
            set_value_by_label(inputs_sheet, label, value)

        # ------------- FETCH MATERIAL COST (using labels) -------------
        summary_sheet = spreadsheet.worksheet("summary")

        def get_cost(label):
            row = get_row_by_label(summary_sheet, label)
            if not row:
                return None, None, None
            return (
                summary_sheet.cell(row, 2).value,  # INR
                summary_sheet.cell(row, 3).value,  # EUR
                summary_sheet.cell(row, 4).value,  # Total %
            )

        # Material Cost summary
        material_cost_inr, material_cost_eur, material_cost_per = get_cost("Material Cost")

        # Rows under it
        resin_inr, resin_eur, resin_per = get_cost("Resin")
        mb_inr, mb_eur, mb_per = get_cost("Masterbatch")
        add_inr, add_eur, add_per = get_cost("Additive")

        return {
            "success": True,
            "message": "Material cost calculated successfully.",
            "data": {
                "material_cost": material_cost_inr,
                "material_cost_eur": material_cost_eur,
                "material_cost_per": material_cost_per,

                "resin_cost": resin_inr,
                "resin_cost_eur": resin_eur,
                "resin_cost_per": resin_per,

                "mb_cost": mb_inr,
                "mb_cost_eur": mb_eur,
                "mb_cost_per": mb_per,

                "add_cost": add_inr,
                "add_cost_eur": add_eur,
                "add_cost_per": add_per
            }
        }

    except Exception as e:
        return {"error": str(e)}
    
@router.post("/update-inputs")
async def update_material_cost_inputs(request: Request):
    try:
        # Read JSON body coming from React
        incoming = await request.json()

        # Send this data to the Google Apps Script as POST
        res = requests.post(APPSCRIPT_URL_POST, json=incoming)
        full = res.json()

        # Extract appscript response
        data = full.get("data", {})
        
        print("AppScript Response: ", full)

        return {
            "success": True,
            "data": data
        }

    except Exception as e:
        return {"error": str(e)}


@router.get("/get-sheet-data")
def get_sheet_data():
    try:
        res = requests.get(APPSCRIPT_URL)
        full = res.json()
        data = full.get('data', {})

        print(full)
        
        return {
            "success": True,
            "data": {
                "weight_g": data['weight_g'],
                "shot1_ratio_pct": data['shot_1_ratio_pct'],
                "shot1_poly_rate": data['shot_1_polymer_rate_inr_per_kg'],
                "shot1_mb_dosage_pct": data['shot_1_masterbatch_dosage_pct'],
                "shot1_mb_rate": data['shot_1_masterbatch_rate_inr_per_kg'],
                "shot1_add_dosage_pct": data['shot_1_additive_dosage_pct'],
                "shot1_add_rate": data['shot_1_additive_rate'],
                "material_cost": data['material_cost_inr'],
                "material_cost_eur": data['material_cost_eur'],
                "material_cost_per": data['material_cost_per'],
                "resin_cost": data['resin_inr'],
                "resin_cost_eur": data['resin_eur'],
                "resin_cost_per": data['resin_per'],
                "mb_cost": data['masterbatch_inr'],
                "mb_cost_eur": data['masterbatch_eur'],
                "mb_cost_per": data['masterbatch_per'],
                "add_cost": data['additive_inr'],
                "add_cost_eur": data['additive_eur'],
                "add_cost_per": data['additive_per']
            }
        }

    except Exception as e:
        return {"error": str(e)}

@router.get("/pp-rate")
def get_polymer_price_rate():
    try:
        #API Scraping to get the polymer price rate (ov idea) but needs testing
        # offset = 0
        # rows, offset = get_more_price(offset)
        
        rows = get_html()
        rows = extract_html_table(rows)
        
        return {'success': True, 'data': rows}
    
    except Exception as e:
        return {"error": str(e)}