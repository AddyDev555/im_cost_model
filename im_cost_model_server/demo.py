import requests

def fetch_google_sheet_appscript():
    APPSCRIPT_URL = "https://script.google.com/macros/s/AKfycby6kdGDrFE_Y45Hl-T2kYHkvKlCaMzp3KU5QqY3lXdW-20P-yqWDOyZeQx0ee-_ORzZ/exec"
    response = requests.get(APPSCRIPT_URL)
    
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": "Failed to fetch data"}
    
if __name__ == "__main__":
    data = fetch_google_sheet_appscript()
    print(data)
