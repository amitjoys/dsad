from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/constructpune_db")
client = AsyncIOMotorClient(MONGO_URL)
db = client.constructpune_db

# Database collections
contacts_collection = db.contacts
projects_collection = db.projects
calculations_collection = db.calculations
users_collection = db.users
admins_collection = db.admins
seo_data_collection = db.seo_data
service_pages_collection = db.service_pages