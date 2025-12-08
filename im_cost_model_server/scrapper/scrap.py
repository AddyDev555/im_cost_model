import requests
from bs4 import BeautifulSoup
import json

URL = "https://plastic4trade.com/polymer-price-today-update-list-graph?category=4&company=5&country=India&state=Gujarat&date="

headers = {
    "User-Agent": "Mozilla/5.0",
    "Accept": "*/*"
}

def get_html():
    response = requests.get(URL, headers=headers)
    response.raise_for_status()
    return response.text


def extract_html_table(html):
    soup = BeautifulSoup(html, "html.parser")

    table = soup.find("table")
    if not table:
        return None

    rows = []
    for tr in table.find_all("tr"):
        cols = [td.get_text(strip=True) for td in tr.find_all(["td", "th"])]
        if cols:
            rows.append(cols)

    # ---------- Convert to JSON inside same function ----------
    if len(rows) < 2:
        return []

    headers = rows[0]
    json_list = []

    for row in rows[1:]:
        obj = {}
        for i in range(len(headers)):
            obj[headers[i]] = row[i] if i < len(row) else None
        json_list.append(obj)

    return json_list


# def main():
#     html = get_html()

#     # Option A: Try HTML table
#     table = extract_html_table(html)
#     if table:
#         print("\n📌 Table Data:")
#         for r in table:
#             print(r)
#         return

# main()