from itsdangerous import URLSafeTimedSerializer
import os

SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key")
SALT = "magic-link"

serializer = URLSafeTimedSerializer(SECRET_KEY)

def generate_magic_token(email: str):
    return serializer.dumps(email, salt=SALT)

def verify_magic_token(token: str, max_age=600):  # 10 minutes
    return serializer.loads(token, salt=SALT, max_age=max_age)