import requests

def fetch_google_sheet_appscript():
    url = "https://script.google.com/macros/s/AKfycbytVO9G4jqaSAIhlpvau48T-btRYpA2I5k6UcsZEg1qYo0PriZZaUhDtiWOq1bygVESxA/exec"
    response = requests.get(url)
    
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": "Failed to fetch data"}
    
if __name__ == "__main__":
    data = fetch_google_sheet_appscript()
    print(data)
