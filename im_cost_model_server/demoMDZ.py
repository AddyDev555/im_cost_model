import requests
import json

url = "https://script.google.com/macros/s/AKfycbw_HZ10lvbT5RJfroX2HDWU8Z4bSKbq2r6iCs8PgYr8VyWph_PSkh4G-93hJ4jdsFn_/exec"

payload = {
    "mode": "fetch",
    "sheetId": "13QMdnykRCLpwjR4-nyQSQ4QZVWKjnzoY_D_UTMJyU2E",
    "countryName": "India",
    "costModelKey": "Mondeleze"
}

headers = {
    "Content-Type": "application/json"
}

response = requests.post(
    url,
    data=json.dumps(payload),
    headers=headers,
    timeout=30
)

print("Status Code:", response.status_code)
print("Response Text:", response.text)

# If your Apps Script returns JSON
try:
    print("Response JSON:", response.json())
except Exception:
    print("Response is not JSON")