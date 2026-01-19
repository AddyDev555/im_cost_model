import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()

# Your webhook URL
WEBHOOK_URL = os.getenv("WEBHOOK_URL")


def send_magic_link(email: str, token: str):
    SECRET_KEY = "1234567890abcdef"

    # Build magic link
    magic_link = f"{os.getenv('FRONTEND_URL')}/verify?token={token}"

    # Prepare payload
    payload = {
        "subject": "Verify your email",
        "to": email,
        "body": f"""
Click the link below to verify your email:

{magic_link}

This link expires in 10 minutes.
""", 
        "secret_key": SECRET_KEY
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
