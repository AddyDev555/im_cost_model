# routers/sheets.py
from fastapi import APIRouter, HTTPException
from dotenv import load_dotenv
import os
import requests
import re
import json
from transformers import T5Tokenizer, T5ForConditionalGeneration


router = APIRouter()
load_dotenv()

APPS_SCRIPT_URL = os.getenv("APPSCRIPT_GS_URL")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
DATA_FILE = "../data.json"

MODEL_NAME = "google/flan-t5-base"
MODEL_DIR = "./models/flan-t5-base"

print("⬇️ Downloading tokenizer...")
tokenizer = T5Tokenizer.from_pretrained(
    MODEL_NAME,
    cache_dir=MODEL_DIR
)

print("⬇️ Downloading model...")
model = T5ForConditionalGeneration.from_pretrained(
    MODEL_NAME,
    cache_dir=MODEL_DIR
)

def ask(prompt: str) -> str:
    inputs = tokenizer(prompt, return_tensors="pt")
    outputs = model.generate(
        **inputs,
        max_length=256,
        temperature=0.3
    )
    return tokenizer.decode(outputs[0], skip_special_tokens=True)


def update_qna(question: str, answer: str):
    """Reads data.json, appends a new Q&A object, and writes it back."""
    try:
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, "r") as f:
                data = json.load(f)
        else:
            data = {"notes": [], "qna": []}

        data.setdefault("qna", []).append({"question": question, "answer": answer})

        with open(DATA_FILE, "w") as f:
            json.dump(data, f, indent=4)
    except Exception as e:
        # Log the error or handle it as needed, but don't block the main response
        print(f"Error updating Q&A file: {e}")


def clean_gemini_answer(text: str) -> str:
    text = text.replace("```", "").replace("`", "")
    text = re.sub(r"[*_#]+", "", text)
    text = re.sub(r"[\$\(\)\[\]\{\}]", "", text)
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"\s+([.,])", r"\1", text)
    return text.strip()


@router.post("/ask")
def ask_sheet(payload: dict):

    mode = payload.get("mode", "question")

    try:
        # ---------------------------
        # CALL APPS SCRIPT
        # ---------------------------
        response = requests.post(APPS_SCRIPT_URL, json=payload, timeout=25)

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Apps Script error: {response.text}"
            )

        data = response.json().get("data", {})

        # ============================================================
        # MODE: ask_all — NOW CALLS GEMINI FOR ALL SHEETS
        # ============================================================
        if mode == "ask_all":
            # Build a combined prompt for all sheets
            combined = ""

            for sheet_name, sheet_content in data.items():
                values = sheet_content.get("values", [])
                formulas = sheet_content.get("formulas", [])

                combined += f"""
### Sheet: {sheet_name}

DATA:
{values}

FORMULAS:
{formulas}

---
"""

            final_prompt = f"""
You are an AI assistant specializing in interpreting entire Google Sheets workbooks.

### Your Task:
For each sheet below:
- Explain the sheet's purpose.
- Summarize the key fields using their label names only.
- Convert formulas into simple mathematical equations.
- Keep each sheet summary short and relevant.
- No cell references, ever.
- Show each sheet in its own section.

### Workbook Sheets:
{combined}

Provide a clean and concise summary per sheet.
"""

            # Gemini API call
            gemini_payload = {"contents": [{"parts": [{"text": final_prompt}]}]}

            gemini_response = requests.post(
                f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key={GEMINI_API_KEY}",
                json=gemini_payload,
                timeout=60
            )

            if gemini_response.status_code != 200:
                raise HTTPException(
                    status_code=gemini_response.status_code,
                    detail=f"Gemini API error: {gemini_response.text}"
                )

            parts = (
                gemini_response.json()
                .get("candidates", [{}])[0]
                .get("content", {})
                .get("parts", [])
            )

            answer = parts[0].get("text", "No answer returned") if parts else "No answer returned"
            
            # answer = ask(final_prompt)

            # Save Q&A to data.json
            update_qna(question="Summarize all sheets.", answer=answer)

            return {
                "success": True,
                "mode": "ask_all",
                "answer": answer,
                "sheets": list(data.keys())
            }

        # ============================================================
        # MODE: ask — single sheet + Gemini
        # ============================================================
        if mode == "ask":
            sheet_name = data.get("sheetName")
            values = data.get("values", [])
            formulas = data.get("formulas", [])
            question = payload.get("question", "")

            prompt = f"""
You are an AI assistant specialized in understanding Google Sheets.

### Rules:
- Use only label names.
- Never reference cell addresses.
- Convert formulas into mathematical equations.
- Keep answers short.

### Sheet Name:
{sheet_name}

### Sheet Data:
{values}

### Sheet Formulas:
{formulas}

### Question:
{question}
"""

            gemini_payload = {"contents": [{"parts": [{"text": prompt}]}]}

            gemini_response = requests.post(
                f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key={GEMINI_API_KEY}",
                json=gemini_payload,
                timeout=60
            )

            parts = (
                gemini_response.json()
                .get("candidates", [{}])[0]
                .get("content", {})
                .get("parts", [])
            )

            answer = parts[0].get("text", "No answer returned") if parts else "No answer returned"

            # answer = ask(final_prompt)
            
            # Save Q&A to data.json
            update_qna(question=question, answer=answer)

            return {
                "success": True,
                "mode": "ask",
                "answer": answer
            }

        # ============================================================
        # MODE: all_sheet — summary of single sheet
        # ============================================================
        if mode == "all_sheet":
            sheet_name = data.get("sheetName")
            values = data.get("values", [])
            formulas = data.get("formulas", [])

            prompt = f"""
Provide a compact summary of the following sheet.
Rules:
- Use label names only.
- No cell references.
- Convert formulas into simple mathematical equations.
- Use bullet points.

Sheet Name: {sheet_name}
Data: {values}
Formulas: {formulas}
"""

            gemini_payload = {"contents": [{"parts": [{"text": prompt}]}]}

            gemini_response = requests.post(
                f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key={GEMINI_API_KEY}",
                json=gemini_payload,
                timeout=60
            )

            parts = (
                gemini_response.json()
                .get("candidates", [{}])[0]
                .get("content", {})
                .get("parts", [])
            )

            answer = parts[0].get("text", "No answer returned") if parts else "No answer returned"

            # Save Q&A to data.json
            update_qna(question=f"Summarize sheet: {sheet_name}", answer=answer)

            return {
                "success": True,
                "mode": "all_sheet",
                "answer": answer
            }

        return {"success": False, "message": "Invalid mode"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))