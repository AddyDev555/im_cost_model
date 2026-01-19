import os
import base64
import hashlib
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

SECRET_KEY = "MY_SUPER_CONSTANT_SECRET_123"

def encrypt_text(plain_text: str) -> str:
    # Derive 32-byte key from secret
    key = hashlib.sha256(SECRET_KEY.encode()).digest()

    aesgcm = AESGCM(key)
    nonce = os.urandom(12)  # 96-bit nonce (recommended)

    encrypted = aesgcm.encrypt(nonce, plain_text.encode(), None)

    # nonce + cipher → base64
    return base64.urlsafe_b64encode(nonce + encrypted).decode()
