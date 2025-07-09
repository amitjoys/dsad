import os
from dotenv import load_dotenv

load_dotenv()

# Security
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

# Database
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/constructpune_db")

# CORS settings
ALLOWED_ORIGINS = ["*"]
ALLOWED_METHODS = ["*"]
ALLOWED_HEADERS = ["*"]
ALLOW_CREDENTIALS = True