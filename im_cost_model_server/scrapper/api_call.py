import requests
from datetime import datetime

BASE_URL = "https://plastic4trade.com/"

session = requests.Session()

session.cookies.update({
    "XSRF-TOKEN": "4YwcX6r7XwAxhlnz0iQ6Lmut6StYjf4BQayvbNzv",
    "laravel_session": "XSRF-TOKEN=eyJpdiI6Ik5TaWFYZGV5dVdQR2pDdS9SSnUxZWc9PSIsInZhbHVlIjoiOVdhVThBTGgzeXZsd1dJK2F4VU9WRy8zZ2N6anNlQTNSZjFBTDNHa1BMY3lUNFpONVhVRXJ2MklHNU5nRHBlZU9xTGZSY0NTbnpqR1JlY3NIYmpoZUdSUWN1aEc3Yzkra0FodXFEamdPcHBqV0pQbndwRmtBU3BKeHFBVE9Mdm0iLCJtYWMiOiI1ZmVlYTk5OTg5MGFhYjRkMzg1ZGZmM2ZjNTdkMmJlNmFhZDQ2NjU5NjUzMjNkNDZjYTJmYmRiOTQ1MTI5Y2MxIiwidGFnIjoiIn0%3D; plastic4trade_session=eyJpdiI6IjIxVlpqUGJMR3ExaThLZ1lTT21Da3c9PSIsInZhbHVlIjoiNlV3N0hHaEhLVFcyWFF4bWpYbEFyUlc0cFRMWEtFY3NIdG43aEZKMHVSY09ubmNEZ05SeG1UeDdDcGgvVkk5bzhXeWpUS1pVRzJNWXZWSG9DUXRvMys1Nmp4UUIvaUZTcnAzbnNtV21lOVdhRGYzZGVCcXFZSjJHUDI0UW45WlAiLCJtYWMiOiJlOTMzOWFjYmRlZTdlNzg3YmUwMjE0NWU1NWU5YThkYTM2NDVkYWY0Yjk2ODllZTAzMmZlODA4NjM3YjkzMWU4IiwidGFnIjoiIn0%3D",
})

session.headers.update({
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "X-Requested-With": "XMLHttpRequest",
    "X-CSRF-TOKEN": "4YwcX6r7XwAxhlnz0iQ6Lmut6StYjf4BQayvbNzv",
    "User-Agent": "Mozilla/5.0",
})

def get_more_price(offset):

    url = f"{BASE_URL}ajaxgetliveprice/{offset}"

    data = {
        "_token": session.headers.get("X-CSRF-TOKEN"),
        "state": "",
        "date": "",
        "category": "",
        "company": "",
        "country": "",
    }


    response = session.post(url, data=data)

    if response.status_code == 419:
        raise Exception("❌ 419 Error → Missing or invalid cookies/session")

    response.raise_for_status()
    data_json = response.json()
    prices = data_json.get("prices", [])

    rows = []
    for i, item in enumerate(prices, start=1):
        dt = datetime.strptime(item["price_date"], "%Y-%m-%d")
        formatted = dt.strftime("%d-%m-%Y")

        rows.append({
            "S.No": offset + i,
            "Category": item["product_category_type"],
            "Grade": item["product_grade_type"],
            "Code": item["product_code"],
            "Date": formatted,
            "Price": f"{item['currency']}{item['price']}",
            "Change": item["changed"],
            "Company": item["company_name"],
            "State": item["state"],
            "Country": item["country"],
        })

    return rows, offset + len(prices)

# offset = 10
# rows, offset = get_more_price(offset)
