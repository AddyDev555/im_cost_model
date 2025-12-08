from fastapi import APIRouter, Request
from google_sheets_con import open_google_spreadsheet
from scrapper.api_call import get_more_price
from scrapper.scrap import get_html, extract_html_table

router = APIRouter()

@router.get("/get-inputs")
async def get_material_cost_inputs():
    try:
        spreadsheet = open_google_spreadsheet()
        
        if not spreadsheet:
            return {"error": "Unable to access the Google Spreadsheet."}
        
        inputs_sheet = spreadsheet.worksheet("input")
        
        weight_g = inputs_sheet.acell('C11').value
        
        shot1_ratio_pct = inputs_sheet.acell('C12').value
        
        shot1_poly_rate = inputs_sheet.acell('C15').value
        
        shot1_mb_dosage_pct = inputs_sheet.acell('C16').value
        
        shot1_mb_rate = inputs_sheet.acell('C17').value
        
        shot1_add_dosage_pct = inputs_sheet.acell('C18').value
        
        shot1_add_rate = inputs_sheet.acell('C19').value

        material_cost_sheet = spreadsheet.worksheet("summary")
        
        resin_cost = material_cost_sheet.acell('B13').value
        
        resin_cost_eur = material_cost_sheet.acell('C13').value
        
        resin_cost_per = material_cost_sheet.acell('D13').value
        
        mb_cost = material_cost_sheet.acell('B14').value
        
        mb_cost_eur = material_cost_sheet.acell('C14').value
        
        mb_cost_per = material_cost_sheet.acell('D14').value
        
        add_cost = material_cost_sheet.acell('B15').value
        
        add_cost_eur = material_cost_sheet.acell('C15').value
        
        add_cost_per = material_cost_sheet.acell('D15').value
        
        material_cost = material_cost_sheet.acell('B12').value
        
        material_cost_eur = material_cost_sheet.acell('C12').value
        
        material_cost_per = material_cost_sheet.acell('D12').value
                
        return {'success': True, 'data': {
            'weight_g': weight_g,
            'shot1_ratio_pct': shot1_ratio_pct,
            'shot1_poly_rate': shot1_poly_rate,
            'shot1_mb_dosage_pct': shot1_mb_dosage_pct,
            'shot1_add_dosage_pct': shot1_add_dosage_pct,
            'shot1_mb_rate': shot1_mb_rate,
            'shot1_add_rate': shot1_add_rate,
            'resin_cost': resin_cost,   
            'resin_cost_per': resin_cost_per,
            'resin_cost_eur': resin_cost_eur,
            'mb_cost': mb_cost,
            'mb_cost_per': mb_cost_per,
            'mb_cost_eur': mb_cost_eur,
            'add_cost': add_cost,
            'add_cost_per': add_cost_per,
            'add_cost_eur': add_cost_eur,
            'material_cost': material_cost,
            'material_cost_eur': material_cost_eur,
            'material_cost_per': material_cost_per
        }}
        
    except Exception as e:
        return {"error": str(e)}

@router.post("/calculator")
async def material_cost_calculator(request: Request):
    try:
        data = await request.json()

        # Loading google spreadsheet from google_sheets_con.py
        spreadsheet = open_google_spreadsheet()
        if not spreadsheet:
            return {"error": "Unable to access the Google Spreadsheet."}
        
        inputs_sheet = spreadsheet.worksheet("input")

        # Update the polymer weight according to the input as (row, column, new_value)
        inputs_sheet.update_cell(11, 3, data['weight_g'])
        
        inputs_sheet.update_cell(12, 3, data['shot1_ratio_pct'])
        
        inputs_sheet.update_cell(15, 3, data['shot1_poly_rate'])
        
        inputs_sheet.update_cell(16, 3, data['shot1_mb_dosage_pct'])
        
        inputs_sheet.update_cell(17, 3, data['shot1_mb_rate'])
        
        inputs_sheet.update_cell(18, 3, data['shot1_add_dosage_pct'])
        
        inputs_sheet.update_cell(19, 3, data['shot1_add_rate'])
        
        inputs_sheet.update_cell(21, 3, data['shot2_ratio_pct'])
                
        inputs_sheet.update_cell(25, 3, data['shot2_poly_rate'])
        
        inputs_sheet.update_cell(26, 3, data['shot2_mb_dosage_pct'])
        
        inputs_sheet.update_cell(27, 3, data['shot2_mb_rate'])
        
        inputs_sheet.update_cell(28, 3, data['shot2_add_dosage_pct'])
        
        inputs_sheet.update_cell(29, 3, data['shot2_add_rate'])
        
        material_cost_sheet = spreadsheet.worksheet("summary")
        
        resin_cost = material_cost_sheet.acell('B13').value
        
        resin_cost_eur = material_cost_sheet.acell('C13').value
        
        resin_cost_per = material_cost_sheet.acell('D13').value
        
        mb_cost = material_cost_sheet.acell('B14').value
        
        mb_cost_eur = material_cost_sheet.acell('C14').value
        
        mb_cost_per = material_cost_sheet.acell('D14').value
        
        add_cost = material_cost_sheet.acell('B15').value
        
        add_cost_eur = material_cost_sheet.acell('C15').value
        
        add_cost_per = material_cost_sheet.acell('D15').value
        
        material_cost = material_cost_sheet.acell('B12').value
        
        material_cost_eur = material_cost_sheet.acell('C12').value
        
        material_cost_per = material_cost_sheet.acell('D12').value

        return {'success': True, 'message': 'Material cost calculated successfully.', 'data': {
            'resin_cost': resin_cost,
            'resin_cost_per': resin_cost_per,
            'resin_cost_eur': resin_cost_eur,
            'mb_cost': mb_cost,
            'mb_cost_per': mb_cost_per,
            'mb_cost_eur': mb_cost_eur,
            'add_cost': add_cost,
            'add_cost_per': add_cost_per,
            'add_cost_eur': add_cost_eur,
            'material_cost': material_cost,
            'material_cost_eur': material_cost_eur,
            'material_cost_per': material_cost_per
        }}

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