from fastapi import APIRouter
from google_sheets_con import open_google_spreadsheet

router = APIRouter()

def get_row_by_label(sheet, label):
    """Return row number for a given label."""
    cell = sheet.find(label)
    return cell.row if cell else None

def load_sheet_as_map(sheet, label_col=1, value_col=3):
    """
    Read entire sheet at once & build {label: value} dictionary.
    label_col/value_col are 1-indexed.
    """
    rows = sheet.get_all_values()  # ONE API CALL
    data_map = {}

    for row in rows:
        if len(row) >= value_col:
            label = row[label_col - 1]
            value = row[value_col - 1]
            if label:
                data_map[label] = value

    return data_map


@router.get("/get-conversion-cost-inputs")
async def get_conversion_cost_inputs():
    try:
        spreadsheet = open_google_spreadsheet()
        input_sheet = spreadsheet.worksheet("input")
        summary_sheet = spreadsheet.worksheet("summary")

        # Load everything from inputs at once
        data = load_sheet_as_map(input_sheet)
        
        def get_cost(label):
            row = get_row_by_label(summary_sheet, label)
            if not row:
                return None, None, None
            return (
                summary_sheet.cell(row, 2).value,  # INR
                summary_sheet.cell(row, 3).value,  # EUR
                summary_sheet.cell(row, 4).value,  # Total %
            )
        
        # Load everything from summary at once
        conversion_cost_inr, conversion_cost_eur, conversion_cost_per = get_cost("Conversion Cost")
        electricity_inr, electricity_eur, electricity_per = get_cost("Electricity")
        labour_direct_inr, labour_direct_eur, labour_direct_per = get_cost("Labour-Direct")
        labour_indirect_inr, labour_indirect_eur, labour_indirect_per = get_cost("Labour-Indirect")
        repair_maintenance_inr, repair_maintenance_eur, repair_maintenance_per = get_cost("Repair & Maintenance")
        overheads_inr, overheads_eur, overheads_per = get_cost("Other Overheads")
        lease_cost_inr, lease_cost_eur, lease_cost_per = get_cost("Lease")
        depreciation_inr, depreciation_eur, depreciation_per = get_cost("Depreciation")
        interest_inr, interest_eur, interest_per = get_cost("Interest")
        margin_inr, margin_eur, margin_per = get_cost("Margin")
        distribution_inr, distribution_eur, distribution_per = get_cost("Distribution")
        packgaging_inr, packgaging_eur, packgaging_per = get_cost("Packaging")
        freight_inr, freight_eur, freight_per = get_cost("Freight")

        return {"success": True, "data": {
        'electricity_rate': data.get("Electricity Rate"),
        'skilled_labour_rate': data.get("Skilled Labour"),
        'engineer_rate': data.get("Engineer"),
        'production_manager': data.get("Production Manager"),
        'repair_maintainance': data.get("Repair & Maintainance"),
        'other_overheads': data.get("Other Overheads"),
        'depreciation_on_plant_machinery': data.get("Depreciation on Plant & Machinery"),
        'depreciation_on_building': data.get("Depreciation on Building"),
        'completed_life_of_asset': data.get("Completed life of asset"),
        'land_cost': data.get("Land Cost"),
        'building_investment': data.get("Building Investment"),
        'lease_cost': data.get("Lease Cost"),
        'type_of_premises': data.get("Type of Premises"),
        'interest_on_long_term_loan': data.get("Interest on Long Term Loan"),
        'interest_on_working_capital': data.get("Interest on Working Capital"),
        'margin': data.get("Margin"),
        'margin_calculation': data.get("Margin Calculation"),
        'no_of_orders_per_year': data.get("No of Orders / Year"),
        'caps_per_box': data.get("Caps Per Box"),
        'boxes_per_pallet': data.get("Boxes Per Pallet"),
        'pallet_type': data.get("Pallet Type"),
        'type_of_container': data.get("Type of Container"),
        'boxes_per_container': data.get("Boxes Per Container"),
        'shipper_cost': data.get("Shipper Cost"),
        'polybag_cost': data.get("Polybag Cost"),
        'packing_cost': data.get("Packing Cost"),
        'freight_cost_per_container': data.get("Freight cost per container"),
        'days_per_year': data.get("Days per Year"),
        'shifts_per_day': data.get("Shifts per Day"),
        'hours_per_day': data.get("Hours per Day"),
        'efficiency': data.get("Efficiency"),
        'available_hours_per_year': data.get("Available hours per year"),
        'conversion_cost_inr': conversion_cost_inr,
        'conversion_cost_eur': conversion_cost_eur,
        'conversion_cost_per': conversion_cost_per,
        'electricity_inr': electricity_inr,
        'electricity_eur': electricity_eur,
        'electricity_per': electricity_per,
        'labour_direct_inr': labour_direct_inr,
        'labour_direct_eur': labour_direct_eur,
        'labour_direct_per': labour_direct_per,
        'labour_indirect_inr': labour_indirect_inr,
        'labour_indirect_eur': labour_indirect_eur,
        'labour_indirect_per': labour_indirect_per,
        'repair_maintenance_inr': repair_maintenance_inr,
        'repair_maintenance_eur': repair_maintenance_eur,
        'repair_maintenance_per': repair_maintenance_per,
        'overheads_inr': overheads_inr,
        'overheads_eur': overheads_eur,
        'overheads_per': overheads_per,
        'lease_cost_inr': lease_cost_inr,
        'lease_cost_eur': lease_cost_eur,
        'lease_cost_per': lease_cost_per,
        'depreciation_inr': depreciation_inr,
        'depreciation_eur': depreciation_eur,
        'depreciation_per': depreciation_per,
        'interest_inr': interest_inr,
        'interest_eur': interest_eur,
        'interest_per': interest_per,
        'margin_inr': margin_inr,
        'margin_eur': margin_eur,
        'margin_per': margin_per,
        'distribution_inr': distribution_inr,
        'distribution_eur': distribution_eur,
        'distribution_per': distribution_per,
        'packgaging_inr': packgaging_inr,
        'packgaging_eur': packgaging_eur,
        'packgaging_per': packgaging_per,
        'freight_inr': freight_inr,
        'freight_eur': freight_eur,
        'freight_per': freight_per,
        }}

    except Exception as e:
        return {"error": str(e)}