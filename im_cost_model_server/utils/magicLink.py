import os
import json
import requests
from dotenv import load_dotenv
from .encrpt_code import encrypt_text

load_dotenv()

WEBHOOK_URL = os.getenv("WEBHOOK_URL")

def send_magic_link(email: str, token: str):
    # Encrypt the email (token)
    encrypted_token = encrypt_text(email)

    # Build magic link
    magic_link = f"{os.getenv('FRONTEND_URL')}/verify?token={encrypted_token}"

    # Prepare payload
    payload = {
        "subject": "Verify your email",
        "from": os.getenv("EMAIL"),  # Optional, for reference
        "to": email,
        "body": f"""
Click the link below to verify your email:

{magic_link}

This link expires in 10 minutes.
"""
    }

    try:
        response = requests.post(
            WEBHOOK_URL,
            headers={"Content-Type": "application/json"},
            data=json.dumps(payload),
            timeout=10
        )
        response.raise_for_status()
        print(f"Magic link sent to webhook for {email}, status: {response.status_code}")
    except requests.RequestException as e:
        print(f"Failed to send magic link to webhook: {repr(e)}")
        raise
