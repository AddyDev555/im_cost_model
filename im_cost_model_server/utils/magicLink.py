import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv
import os

load_dotenv()

def send_magic_link(email: str, token: str):
    magic_link = f"{os.getenv('FRONTEND_URL')}/verify?token={token}"

    msg = MIMEText(f"""
Click the link below to verify your email:

{magic_link}

This link expires in 10 minutes.
""")

    msg["Subject"] = "Verify your email"
    msg["From"] = os.getenv("EMAIL")
    msg["To"] = email

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(os.getenv("EMAIL"), os.getenv("APP_PASSWORD"))
        server.send_message(msg)
