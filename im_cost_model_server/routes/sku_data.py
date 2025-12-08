from fastapi import APIRouter, Request
from google_sheets_con import open_google_spreadsheet

router = APIRouter()

@router.get("/get-sku-inputs")
async def get_sku_data_inputs():
    try:
        spreadsheet = open_google_spreadsheet()
        
        if not spreadsheet:
            return {"error": "Unable to access the Google Spreadsheet."}
        
        inputs_sheet = spreadsheet.worksheet("input")
        
        sku_desc = inputs_sheet.acell('C2').value
        sku_code = inputs_sheet.acell('C3').value
        sku_country = inputs_sheet.acell('C4').value
        sku_currency = inputs_sheet.acell('C5').value
        sku_supplier = inputs_sheet.acell('C6').value
        costing_period = inputs_sheet.acell('C7').value
        annual_volume = inputs_sheet.acell('C8').value
        mould_cavitation = inputs_sheet.acell('C34').value
        mould_cycle_time = inputs_sheet.acell('C35').value
        machine_model_tonnage = inputs_sheet.acell('C36').value
        no_of_setups_per_year = inputs_sheet.acell('C37').value
        no_of_ramp_ups_per_year = inputs_sheet.acell('C38').value
        
        summary_sheet = spreadsheet.worksheet("summary")
        
        material_cost_inr = summary_sheet.acell('B5').value
        material_cost_eur = summary_sheet.acell('C5').value
        material_cost_per = summary_sheet.acell('D5').value
        
        conversion_cost_inr = summary_sheet.acell('B6').value
        conversion_cost_eur = summary_sheet.acell('C6').value
        conversion_cost_per = summary_sheet.acell('D6').value
        
        margin_cost_inr = summary_sheet.acell('B7').value
        margin_cost_eur = summary_sheet.acell('C7').value
        margin_cost_per = summary_sheet.acell('D7').value
        
        packaging_cost_inr = summary_sheet.acell('B8').value
        packaging_cost_eur = summary_sheet.acell('C8').value
        packaging_cost_per = summary_sheet.acell('D8').value
        
        freight_cost_inr = summary_sheet.acell('B9').value
        freight_cost_eur = summary_sheet.acell('C9').value
        freight_cost_per = summary_sheet.acell('D9').value
                
        return {'success': True, 'data': {
            'sku_desc': sku_desc,
            'sku_code': sku_code,
            'sku_country': sku_country,
            'sku_currency': sku_currency,
            'sku_supplier': sku_supplier,
            'costing_period': costing_period,
            'annual_volume': annual_volume,
            'mould_cavitation': mould_cavitation,
            'mould_cycle_time': mould_cycle_time,
            'machine_model_tonnage': machine_model_tonnage,
            'no_of_setups_per_year': no_of_setups_per_year,
            'no_of_ramp_ups_per_year': no_of_ramp_ups_per_year,
            'material_cost_inr': material_cost_inr,
            'material_cost_eur': material_cost_eur,
            'material_cost_per': material_cost_per,
            'conversion_cost_inr': conversion_cost_inr,
            'conversion_cost_eur': conversion_cost_eur,
            'conversion_cost_per': conversion_cost_per,
            'margin_cost_inr': margin_cost_inr,
            'margin_cost_eur': margin_cost_eur,
            'margin_cost_per': margin_cost_per,
            'packaging_cost_inr': packaging_cost_inr,
            'packaging_cost_eur': packaging_cost_eur,
            'packaging_cost_per': packaging_cost_per,
            'freight_cost_inr': freight_cost_inr,
            'freight_cost_eur': freight_cost_eur,
            'freight_cost_per': freight_cost_per
        }}
    except Exception as e:
        return {"error": str(e)}

@router.post("/update-sku-inputs")
async def update_sku_data(request: Request):
    try:
        data = await request.json()
        
        spreadsheet = open_google_spreadsheet()
        if not spreadsheet:
            return {"error": "Unable to access the Google Spreadsheet."}
        
        inputs_sheet = spreadsheet.worksheet("input")
        inputs_sheet.update_acell('C2', data['sku_desc'])
        inputs_sheet.update_acell('C3', data['sku_code'])
        inputs_sheet.update_acell('C4', data['sku_country'])
        inputs_sheet.update_acell('C5', data['sku_currency'])
        inputs_sheet.update_acell('C6', data['sku_supplier'])
        inputs_sheet.update_acell('C7', data['costing_period'])
        inputs_sheet.update_acell('C8', data['annual_volume'])
        inputs_sheet.update_acell('C34', data['mould_cavitation'])
        inputs_sheet.update_acell('C35', data['mould_cycle_time'])
        inputs_sheet.update_acell('C36', data['machine_model_tonnage'])
        inputs_sheet.update_acell('C37', data['no_of_setups_per_year'])
        inputs_sheet.update_acell('C38', data['no_of_ramp_ups_per_year'])
        
        # After updating, refetch all data to get calculated values and return it
        # This reuses the logic from the GET endpoint to ensure consistency
        updated_data = get_sku_data_inputs_sync(spreadsheet)

        return {'success': True, 'message': 'SKU data updated successfully.', 'data': updated_data['data']}
        
    except Exception as e:
        return {"error": str(e)}

def get_sku_data_inputs_sync(spreadsheet):
    """Synchronous helper to fetch all data from the spreadsheet."""
    inputs_sheet = spreadsheet.worksheet("input")
    summary_sheet = spreadsheet.worksheet("summary")
    
    return {'data': {
        'sku_desc': inputs_sheet.acell('C2').value,
        'sku_code': inputs_sheet.acell('C3').value,
        'sku_country': inputs_sheet.acell('C4').value,
        'sku_currency': inputs_sheet.acell('C5').value,
        'sku_supplier': inputs_sheet.acell('C6').value,
        'costing_period': inputs_sheet.acell('C7').value,
        'annual_volume': inputs_sheet.acell('C8').value,
        'mould_cavitation': inputs_sheet.acell('C34').value,
        'mould_cycle_time': inputs_sheet.acell('C35').value,
        'machine_model_tonnage': inputs_sheet.acell('C36').value,
        'no_of_setups_per_year': inputs_sheet.acell('C37').value,
        'no_of_ramp_ups_per_year': inputs_sheet.acell('C38').value,
        'material_cost_inr': summary_sheet.acell('B5').value,
        'material_cost_eur': summary_sheet.acell('C5').value,
        'material_cost_per': summary_sheet.acell('D5').value,
        'conversion_cost_inr': summary_sheet.acell('B6').value,
        'conversion_cost_eur': summary_sheet.acell('C6').value,
        'conversion_cost_per': summary_sheet.acell('D6').value,
        'margin_cost_inr': summary_sheet.acell('B7').value,
        'margin_cost_eur': summary_sheet.acell('C7').value,
        'margin_cost_per': summary_sheet.acell('D7').value,
        'packaging_cost_inr': summary_sheet.acell('B8').value,
        'packaging_cost_eur': summary_sheet.acell('C8').value,
        'packaging_cost_per': summary_sheet.acell('D8').value,
        'freight_cost_inr': summary_sheet.acell('B9').value,
        'freight_cost_eur': summary_sheet.acell('C9').value,
        'freight_cost_per': summary_sheet.acell('D9').value
    }}