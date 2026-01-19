import os
import resend

resend.api_key = os.getenv("RESEND_API_KEY")

def send_magic_link(email: str, token: str):
    frontend = os.getenv("FRONTEND_URL")
    sender = os.getenv("EMAIL")

    if not frontend or not sender:
        raise RuntimeError("Missing FRONTEND_URL or EMAIL")

    magic_link = f"{frontend}/verify?token={token}"

    resend.Emails.send({
        "from": sender,
        "to": email,
        "subject": "Verify your email",
        "html": f"""
        <p>Click the link below to verify your email:</p>
        <p><a href="{magic_link}">Verify Email</a></p>
        <p>This link expires in 10 minutes.</p>
        """
    })

    print(f"Magic link sent to {email}")
