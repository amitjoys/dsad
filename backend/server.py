from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from typing import Optional, List
import os
from dotenv import load_dotenv
import uvicorn
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import uuid
import requests
from bs4 import BeautifulSoup
import asyncio
import httpx
import json
import re

load_dotenv()

app = FastAPI(title="ConstructPune API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# MongoDB connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/constructpune_db")
client = AsyncIOMotorClient(MONGO_URL)
db = client.constructpune_db

# Security
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

# Pydantic models
class ContactForm(BaseModel):
    name: str
    email: str
    phone: str
    message: str
    service_type: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)

class Project(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    image_url: str
    category: str
    created_at: datetime = Field(default_factory=datetime.now)

class CalculatorRequest(BaseModel):
    project_type: str
    area: float
    location: str
    materials: List[str]
    labor_types: List[str]
    quality_level: str = "standard"  # standard, premium, luxury

class CalculatorResult(BaseModel):
    project_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    total_cost: float
    material_costs: dict
    labor_costs: dict
    breakdown: dict
    location: str
    created_at: datetime = Field(default_factory=datetime.now)

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    phone: Optional[str] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.now)

class UserCreate(BaseModel):
    email: str
    password: str
    name: str
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# Authentication functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = await db.users.find_one({"email": email})
    if user is None:
        raise credentials_exception
    return user

# Price scraping functions
async def scrape_material_prices(location: str, materials: List[str]):
    """Scrape material prices from various sources"""
    prices = {}
    
    # Mock prices for now - in production, implement actual web scraping
    base_prices = {
        "cement": {"price": 350, "unit": "per bag", "location": location},
        "steel": {"price": 65, "unit": "per kg", "location": location},
        "bricks": {"price": 8, "unit": "per piece", "location": location},
        "sand": {"price": 25, "unit": "per cft", "location": location},
        "tiles": {"price": 35, "unit": "per sq ft", "location": location},
        "paint": {"price": 125, "unit": "per litre", "location": location},
        "wood": {"price": 45, "unit": "per sq ft", "location": location},
        "glass": {"price": 85, "unit": "per sq ft", "location": location},
        "electrical": {"price": 150, "unit": "per point", "location": location},
        "plumbing": {"price": 200, "unit": "per point", "location": location}
    }
    
    # Location-based price adjustments
    location_multipliers = {
        "mumbai": 1.3,
        "pune": 1.0,
        "bangalore": 1.1,
        "delhi": 1.2,
        "hyderabad": 0.9,
        "chennai": 1.0,
        "kolkata": 0.8,
        "ahmedabad": 0.85
    }
    
    multiplier = location_multipliers.get(location.lower(), 1.0)
    
    for material in materials:
        if material.lower() in base_prices:
            price_info = base_prices[material.lower()].copy()
            price_info["price"] = round(price_info["price"] * multiplier, 2)
            prices[material] = price_info
    
    return prices

async def calculate_labor_costs(location: str, labor_types: List[str], area: float):
    """Calculate labor costs based on location and work type"""
    labor_costs = {}
    
    # Base labor rates per sq ft
    base_rates = {
        "mason": 25,
        "electrical": 35,
        "plumbing": 30,
        "painting": 15,
        "tiling": 20,
        "carpenter": 40,
        "interior": 50,
        "foundation": 45,
        "grills": 200,  # per sq ft
        "glass_doors": 300,  # per sq ft
        "windows": 250  # per sq ft
    }
    
    # Location-based multipliers
    location_multipliers = {
        "mumbai": 1.4,
        "pune": 1.0,
        "bangalore": 1.2,
        "delhi": 1.3,
        "hyderabad": 0.9,
        "chennai": 1.0,
        "kolkata": 0.8,
        "ahmedabad": 0.85
    }
    
    multiplier = location_multipliers.get(location.lower(), 1.0)
    
    for labor_type in labor_types:
        if labor_type.lower() in base_rates:
            base_rate = base_rates[labor_type.lower()]
            adjusted_rate = base_rate * multiplier
            total_cost = adjusted_rate * area
            
            labor_costs[labor_type] = {
                "rate_per_sqft": round(adjusted_rate, 2),
                "total_cost": round(total_cost, 2),
                "area": area,
                "location": location
            }
    
    return labor_costs

# API Routes
@app.get("/api/")
async def root():
    return {"message": "ConstructPune API is running!"}

@app.post("/api/contact", response_model=dict)
async def submit_contact_form(contact: ContactForm):
    """Submit contact form"""
    try:
        contact_dict = contact.model_dump()
        result = await db.contacts.insert_one(contact_dict)
        return {"message": "Contact form submitted successfully", "id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error submitting contact form: {str(e)}")

@app.get("/api/projects", response_model=List[dict])
async def get_projects():
    """Get all projects"""
    try:
        projects = []
        async for project in db.projects.find():
            project["_id"] = str(project["_id"])
            projects.append(project)
        return projects
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching projects: {str(e)}")

@app.post("/api/projects", response_model=dict)
async def create_project(project: Project):
    """Create a new project"""
    try:
        project_dict = project.model_dump()
        result = await db.projects.insert_one(project_dict)
        return {"message": "Project created successfully", "id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating project: {str(e)}")

@app.post("/api/calculator/estimate", response_model=CalculatorResult)
async def calculate_construction_cost(request: CalculatorRequest):
    """Calculate construction costs based on requirements"""
    try:
        # Get material prices
        material_prices = await scrape_material_prices(request.location, request.materials)
        
        # Calculate labor costs
        labor_costs = await calculate_labor_costs(request.location, request.labor_types, request.area)
        
        # Calculate total material costs
        total_material_cost = 0
        material_breakdown = {}
        
        for material, price_info in material_prices.items():
            # Estimate material quantity based on area and type
            quantity = request.area * 1.5  # Base multiplier
            if material.lower() in ["cement", "steel"]:
                quantity = request.area * 2.5
            elif material.lower() in ["bricks"]:
                quantity = request.area * 55  # ~55 bricks per sq ft
            elif material.lower() in ["tiles", "paint"]:
                quantity = request.area * 1.1
            
            material_cost = quantity * price_info["price"]
            total_material_cost += material_cost
            
            material_breakdown[material] = {
                "quantity": round(quantity, 2),
                "unit_price": price_info["price"],
                "total_cost": round(material_cost, 2),
                "unit": price_info["unit"]
            }
        
        # Calculate total labor costs
        total_labor_cost = sum(labor["total_cost"] for labor in labor_costs.values())
        
        # Quality level adjustments
        quality_multipliers = {
            "standard": 1.0,
            "premium": 1.4,
            "luxury": 1.8
        }
        
        quality_multiplier = quality_multipliers.get(request.quality_level, 1.0)
        
        # Calculate final totals
        adjusted_material_cost = total_material_cost * quality_multiplier
        adjusted_labor_cost = total_labor_cost * quality_multiplier
        total_cost = adjusted_material_cost + adjusted_labor_cost
        
        # Add overhead and profit (15%)
        final_total = total_cost * 1.15
        
        result = CalculatorResult(
            total_cost=round(final_total, 2),
            material_costs=material_breakdown,
            labor_costs=labor_costs,
            breakdown={
                "materials_subtotal": round(adjusted_material_cost, 2),
                "labor_subtotal": round(adjusted_labor_cost, 2),
                "quality_level": request.quality_level,
                "quality_multiplier": quality_multiplier,
                "overhead_profit": round(final_total - total_cost, 2),
                "area": request.area,
                "location": request.location
            },
            location=request.location
        )
        
        # Save calculation to database
        result_dict = result.model_dump()
        await db.calculations.insert_one(result_dict)
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating costs: {str(e)}")

@app.get("/api/calculator/materials", response_model=List[str])
async def get_available_materials():
    """Get list of available materials"""
    materials = [
        "cement", "steel", "bricks", "sand", "tiles", "paint", 
        "wood", "glass", "electrical", "plumbing"
    ]
    return materials

@app.get("/api/calculator/labor-types", response_model=List[str])
async def get_labor_types():
    """Get list of available labor types"""
    labor_types = [
        "mason", "electrical", "plumbing", "painting", "tiling", 
        "carpenter", "interior", "foundation", "grills", "glass_doors", "windows"
    ]
    return labor_types

@app.get("/api/calculator/locations", response_model=List[str])
async def get_supported_locations():
    """Get list of supported locations"""
    locations = [
        "Mumbai", "Pune", "Bangalore", "Delhi", "Hyderabad", 
        "Chennai", "Kolkata", "Ahmedabad"
    ]
    return locations

# Authentication routes
@app.post("/api/auth/register", response_model=dict)
async def register(user: UserCreate):
    """Register a new user"""
    try:
        # Check if user already exists
        existing_user = await db.users.find_one({"email": user.email})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Hash password and create user
        hashed_password = get_password_hash(user.password)
        user_dict = {
            "id": str(uuid.uuid4()),
            "email": user.email,
            "name": user.name,
            "phone": user.phone,
            "hashed_password": hashed_password,
            "is_active": True,
            "created_at": datetime.now()
        }
        
        result = await db.users.insert_one(user_dict)
        return {"message": "User registered successfully", "id": str(result.inserted_id)}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error registering user: {str(e)}")

@app.post("/api/auth/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login user"""
    try:
        user = await db.users.find_one({"email": form_data.username})
        if not user or not verify_password(form_data.password, user["hashed_password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user["email"]}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error logging in: {str(e)}")

@app.get("/api/auth/me", response_model=dict)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current user info"""
    current_user["_id"] = str(current_user["_id"])
    return current_user

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)