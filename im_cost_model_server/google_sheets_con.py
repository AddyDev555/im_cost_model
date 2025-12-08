import gspread
from google.oauth2.service_account import Credentials

# Path to your service account JSON
SERVICE_ACCOUNT_FILE = "./imcal.json"

# Scopes required to access Google Sheets
SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
]

def open_google_spreadsheet():
    creds = Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, 
        scopes=SCOPES
    )
    client = gspread.authorize(creds)

    SHEET_ID = "147Fp_Dygi-UF_6vKOTSF77IU0ADTwQ77Sm_g5p5AxNw"

    # Return the entire spreadsheet, not one sheet
    spreadsheet = client.open_by_key(SHEET_ID)
    
    return spreadsheet

# Read a column (example: column D)
# sheet.update_cell(5, 4, 2.0)  
# values = sheet.col_values(4) # column D
# specific_value = values[4]
# print(specific_value)