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
    foundation_type: str = "slab"  # slab, basement, crawl_space
    roof_type: str = "flat"  # flat, sloped, tile, metal
    wall_type: str = "brick"  # brick, concrete, wood_frame
    electrical_complexity: str = "basic"  # basic, advanced, smart_home
    plumbing_complexity: str = "basic"  # basic, premium, luxury
    flooring_type: str = "basic"  # basic, premium, luxury
    finishing_level: str = "standard"  # standard, premium, luxury
    site_preparation: bool = True
    include_permits: bool = True
    include_transportation: bool = True
    building_height: int = 1  # number of floors
    parking_spaces: int = 0
    garden_area: float = 0.0  # in sq ft

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

class AdminUser(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    is_admin: bool = True
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.now)

class AdminUserCreate(BaseModel):
    email: str
    password: str
    name: str

class SEOData(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    page_path: str
    title: str
    description: str
    keywords: List[str]
    meta_tags: dict
    schema_markup: Optional[dict] = None
    content_optimization: Optional[dict] = None
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

class SEOOptimizationRequest(BaseModel):
    page_path: str
    content: str
    target_keywords: List[str]

class ServicePage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: str
    title: str
    description: str
    content: str
    features: List[str]
    pricing_info: dict
    images: List[str]
    seo_data: Optional[dict] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

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

async def get_current_admin(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate admin credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        admin_type: str = payload.get("type")
        if email is None or admin_type != "admin":
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    admin = await db.admins.find_one({"email": email})
    if admin is None:
        raise credentials_exception
    return admin

# Mock Groq API for SEO optimization
async def mock_groq_seo_optimization(content: str, target_keywords: List[str]):
    """Mock Groq API for SEO optimization"""
    # Simulate API processing time
    await asyncio.sleep(0.5)
    
    # Mock SEO analysis and suggestions
    word_count = len(content.split())
    keyword_density = {}
    
    for keyword in target_keywords:
        count = content.lower().count(keyword.lower())
        density = (count / word_count) * 100 if word_count > 0 else 0
        keyword_density[keyword] = {
            "count": count,
            "density": round(density, 2)
        }
    
    # Mock content optimization suggestions
    suggestions = []
    for keyword in target_keywords:
        if keyword_density[keyword]["density"] < 1.0:
            suggestions.append(f"Consider increasing the density of '{keyword}' (current: {keyword_density[keyword]['density']}%)")
        elif keyword_density[keyword]["density"] > 3.0:
            suggestions.append(f"Consider reducing the density of '{keyword}' (current: {keyword_density[keyword]['density']}%)")
    
    # Mock meta descriptions and titles
    title_suggestions = [
        f"Professional {target_keywords[0].title()} Services in Pune",
        f"Best {target_keywords[0].title()} Solutions - ConstructPune",
        f"Expert {target_keywords[0].title()} Services | ConstructPune"
    ] if target_keywords else ["Professional Construction Services in Pune"]
    
    description_suggestions = [
        f"Get professional {target_keywords[0]} services in Pune with ConstructPune. Expert team, quality materials, and guaranteed results.",
        f"ConstructPune offers premium {target_keywords[0]} solutions with skilled professionals and competitive pricing in Pune.",
        f"Transform your space with our expert {target_keywords[0]} services. Quality workmanship and customer satisfaction guaranteed."
    ] if target_keywords else ["Professional construction services in Pune"]
    
    # Mock schema markup
    schema_markup = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": f"{target_keywords[0].title()} Services" if target_keywords else "Construction Services",
        "description": description_suggestions[0],
        "provider": {
            "@type": "Organization",
            "name": "ConstructPune",
            "url": "https://constructpune.com"
        },
        "areaServed": "Pune, Maharashtra, India"
    }
    
    return {
        "keyword_analysis": keyword_density,
        "content_suggestions": suggestions,
        "title_suggestions": title_suggestions,
        "description_suggestions": description_suggestions,
        "schema_markup": schema_markup,
        "readability_score": 85,  # Mock score
        "seo_score": 78  # Mock score
    }

async def generate_seo_audit(page_path: str):
    """Generate SEO audit for a page"""
    await asyncio.sleep(0.3)
    
    # Mock SEO audit data
    return {
        "page_path": page_path,
        "title_check": {
            "exists": True,
            "length": 65,
            "status": "good",
            "suggestion": "Title length is optimal"
        },
        "description_check": {
            "exists": True,
            "length": 158,
            "status": "good",
            "suggestion": "Meta description length is optimal"
        },
        "keywords_check": {
            "density": 2.5,
            "status": "good",
            "suggestion": "Keyword density is within optimal range"
        },
        "headings_check": {
            "h1_count": 1,
            "h2_count": 3,
            "h3_count": 5,
            "status": "good",
            "suggestion": "Heading structure is well organized"
        },
        "images_check": {
            "total_images": 8,
            "alt_text_missing": 2,
            "status": "warning",
            "suggestion": "Add alt text to 2 images"
        },
        "performance_score": 92,
        "seo_score": 85,
        "recommendations": [
            "Add alt text to all images",
            "Optimize image file sizes",
            "Add internal links to related pages",
            "Include FAQ section for better user engagement"
        ]
    }

# Price scraping functions
async def scrape_material_prices(location: str, materials: List[str]):
    """Enhanced material prices with more realistic 2025 pricing"""
    prices = {}
    
    # Updated realistic prices for 2025 (in INR)
    base_prices = {
        # Basic Materials
        "cement": {"price": 420, "unit": "per bag (50kg)", "location": location, "waste_factor": 0.05},
        "steel": {"price": 78, "unit": "per kg", "location": location, "waste_factor": 0.03},
        "bricks": {"price": 12, "unit": "per piece", "location": location, "waste_factor": 0.05},
        "sand": {"price": 35, "unit": "per cft", "location": location, "waste_factor": 0.10},
        "aggregate": {"price": 40, "unit": "per cft", "location": location, "waste_factor": 0.08},
        "concrete_blocks": {"price": 25, "unit": "per piece", "location": location, "waste_factor": 0.03},
        
        # Flooring Materials
        "tiles": {"price": 55, "unit": "per sq ft", "location": location, "waste_factor": 0.10},
        "marble": {"price": 180, "unit": "per sq ft", "location": location, "waste_factor": 0.08},
        "granite": {"price": 120, "unit": "per sq ft", "location": location, "waste_factor": 0.08},
        "ceramic_tiles": {"price": 35, "unit": "per sq ft", "location": location, "waste_factor": 0.10},
        "vitrified_tiles": {"price": 85, "unit": "per sq ft", "location": location, "waste_factor": 0.08},
        
        # Finishing Materials
        "paint": {"price": 180, "unit": "per litre", "location": location, "waste_factor": 0.05},
        "putty": {"price": 25, "unit": "per kg", "location": location, "waste_factor": 0.08},
        "primer": {"price": 150, "unit": "per litre", "location": location, "waste_factor": 0.05},
        
        # Structural Materials
        "wood": {"price": 65, "unit": "per sq ft", "location": location, "waste_factor": 0.15},
        "glass": {"price": 120, "unit": "per sq ft", "location": location, "waste_factor": 0.05},
        "aluminum": {"price": 250, "unit": "per sq ft", "location": location, "waste_factor": 0.08},
        "ms_sections": {"price": 85, "unit": "per kg", "location": location, "waste_factor": 0.05},
        
        # Electrical Materials
        "electrical_wire": {"price": 45, "unit": "per meter", "location": location, "waste_factor": 0.10},
        "electrical_fittings": {"price": 200, "unit": "per point", "location": location, "waste_factor": 0.05},
        "switches_sockets": {"price": 150, "unit": "per point", "location": location, "waste_factor": 0.02},
        "mcb_db": {"price": 2500, "unit": "per unit", "location": location, "waste_factor": 0.00},
        
        # Plumbing Materials
        "pvc_pipes": {"price": 85, "unit": "per meter", "location": location, "waste_factor": 0.10},
        "cp_fittings": {"price": 3500, "unit": "per set", "location": location, "waste_factor": 0.05},
        "sanitary_ware": {"price": 8500, "unit": "per set", "location": location, "waste_factor": 0.02},
        "water_tank": {"price": 12000, "unit": "per unit", "location": location, "waste_factor": 0.00},
        
        # Roofing Materials
        "roofing_tiles": {"price": 45, "unit": "per sq ft", "location": location, "waste_factor": 0.10},
        "waterproofing": {"price": 35, "unit": "per sq ft", "location": location, "waste_factor": 0.08},
        "insulation": {"price": 25, "unit": "per sq ft", "location": location, "waste_factor": 0.05},
        
        # Others
        "hardware": {"price": 150, "unit": "per sq ft", "location": location, "waste_factor": 0.05},
        "adhesives": {"price": 25, "unit": "per sq ft", "location": location, "waste_factor": 0.10}
    }
    
    # Enhanced location-based price adjustments (2025 realistic multipliers)
    location_multipliers = {
        "mumbai": 1.45,
        "pune": 1.0,
        "bangalore": 1.15,
        "delhi": 1.35,
        "noida": 1.30,
        "gurgaon": 1.40,
        "hyderabad": 0.95,
        "chennai": 1.05,
        "kolkata": 0.85,
        "ahmedabad": 0.90,
        "surat": 0.88,
        "lucknow": 0.85,
        "kanpur": 0.82,
        "nagpur": 0.90,
        "indore": 0.88,
        "thane": 1.35,
        "bhopal": 0.85,
        "visakhapatnam": 0.90,
        "pimpri_chinchwad": 0.98,
        "patna": 0.80,
        "vadodara": 0.92,
        "ghaziabad": 1.25,
        "ludhiana": 0.95,
        "agra": 0.85,
        "nashik": 0.95,
        "faridabad": 1.28,
        "meerut": 0.90,
        "rajkot": 0.90,
        "kalyan_dombivli": 1.32,
        "vasai_virar": 1.30,
        "varanasi": 0.82,
        "srinagar": 0.95,
        "aurangabad": 0.88,
        "dhanbad": 0.85,
        "amritsar": 0.90,
        "navi_mumbai": 1.38,
        "allahabad": 0.80,
        "howrah": 0.88,
        "ranchi": 0.88,
        "gwalior": 0.85,
        "jabalpur": 0.82,
        "coimbatore": 0.95
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

# Admin Authentication Routes
@app.post("/api/admin/auth/register", response_model=dict)
async def register_admin(admin: AdminUserCreate):
    """Register a new admin user"""
    try:
        # Check if admin already exists
        existing_admin = await db.admins.find_one({"email": admin.email})
        if existing_admin:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Hash password and create admin
        hashed_password = get_password_hash(admin.password)
        admin_dict = {
            "id": str(uuid.uuid4()),
            "email": admin.email,
            "name": admin.name,
            "hashed_password": hashed_password,
            "is_admin": True,
            "is_active": True,
            "created_at": datetime.now()
        }
        
        result = await db.admins.insert_one(admin_dict)
        return {"message": "Admin registered successfully", "id": str(result.inserted_id)}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error registering admin: {str(e)}")

@app.post("/api/admin/auth/login", response_model=Token)
async def login_admin(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login admin user"""
    try:
        admin = await db.admins.find_one({"email": form_data.username})
        if not admin or not verify_password(form_data.password, admin["hashed_password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": admin["email"], "type": "admin"}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error logging in admin: {str(e)}")

@app.get("/api/admin/auth/me", response_model=dict)
async def get_current_admin_info(current_admin: dict = Depends(get_current_admin)):
    """Get current admin info"""
    current_admin["_id"] = str(current_admin["_id"])
    return current_admin

# SEO Management Routes
@app.post("/api/admin/seo/optimize", response_model=dict)
async def optimize_content_seo(request: SEOOptimizationRequest, current_admin: dict = Depends(get_current_admin)):
    """Optimize content for SEO using Groq API"""
    try:
        # Mock Groq API call
        optimization_result = await mock_groq_seo_optimization(request.content, request.target_keywords)
        
        # Save SEO data to database
        seo_data = SEOData(
            page_path=request.page_path,
            title=optimization_result["title_suggestions"][0],
            description=optimization_result["description_suggestions"][0],
            keywords=request.target_keywords,
            meta_tags={
                "title": optimization_result["title_suggestions"][0],
                "description": optimization_result["description_suggestions"][0],
                "keywords": ", ".join(request.target_keywords)
            },
            schema_markup=optimization_result["schema_markup"],
            content_optimization=optimization_result
        )
        
        # Update or insert SEO data
        await db.seo_data.update_one(
            {"page_path": request.page_path},
            {"$set": seo_data.model_dump()},
            upsert=True
        )
        
        return optimization_result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error optimizing SEO: {str(e)}")

@app.get("/api/admin/seo/audit/{page_path:path}", response_model=dict)
async def get_seo_audit(page_path: str, current_admin: dict = Depends(get_current_admin)):
    """Get SEO audit for a specific page"""
    try:
        audit_result = await generate_seo_audit(page_path)
        return audit_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating SEO audit: {str(e)}")

@app.get("/api/admin/seo/data", response_model=List[dict])
async def get_all_seo_data(current_admin: dict = Depends(get_current_admin)):
    """Get all SEO data"""
    try:
        seo_data = []
        async for data in db.seo_data.find():
            data["_id"] = str(data["_id"])
            seo_data.append(data)
        return seo_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching SEO data: {str(e)}")

@app.get("/api/admin/seo/data/{page_path:path}", response_model=dict)
async def get_seo_data(page_path: str, current_admin: dict = Depends(get_current_admin)):
    """Get SEO data for a specific page"""
    try:
        seo_data = await db.seo_data.find_one({"page_path": page_path})
        if not seo_data:
            raise HTTPException(status_code=404, detail="SEO data not found")
        seo_data["_id"] = str(seo_data["_id"])
        return seo_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching SEO data: {str(e)}")

@app.put("/api/admin/seo/data/{page_path:path}", response_model=dict)
async def update_seo_data(page_path: str, seo_data: SEOData, current_admin: dict = Depends(get_current_admin)):
    """Update SEO data for a specific page"""
    try:
        seo_data.page_path = page_path
        seo_data.updated_at = datetime.now()
        
        result = await db.seo_data.update_one(
            {"page_path": page_path},
            {"$set": seo_data.model_dump()},
            upsert=True
        )
        
        return {"message": "SEO data updated successfully", "modified_count": result.modified_count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating SEO data: {str(e)}")

# Service Pages Management Routes
@app.post("/api/admin/services", response_model=dict)
async def create_service_page(service: ServicePage, current_admin: dict = Depends(get_current_admin)):
    """Create a new service page"""
    try:
        service_dict = service.model_dump()
        result = await db.service_pages.insert_one(service_dict)
        return {"message": "Service page created successfully", "id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating service page: {str(e)}")

@app.get("/api/admin/services", response_model=List[dict])
async def get_all_service_pages(current_admin: dict = Depends(get_current_admin)):
    """Get all service pages"""
    try:
        services = []
        async for service in db.service_pages.find():
            service["_id"] = str(service["_id"])
            services.append(service)
        return services
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching service pages: {str(e)}")

@app.get("/api/admin/services/{slug}", response_model=dict)
async def get_service_page(slug: str, current_admin: dict = Depends(get_current_admin)):
    """Get a specific service page"""
    try:
        service = await db.service_pages.find_one({"slug": slug})
        if not service:
            raise HTTPException(status_code=404, detail="Service page not found")
        service["_id"] = str(service["_id"])
        return service
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching service page: {str(e)}")

@app.put("/api/admin/services/{slug}", response_model=dict)
async def update_service_page(slug: str, service: ServicePage, current_admin: dict = Depends(get_current_admin)):
    """Update a specific service page"""
    try:
        service.slug = slug
        service.updated_at = datetime.now()
        
        result = await db.service_pages.update_one(
            {"slug": slug},
            {"$set": service.model_dump()}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Service page not found")
        
        return {"message": "Service page updated successfully", "modified_count": result.modified_count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating service page: {str(e)}")

@app.delete("/api/admin/services/{slug}", response_model=dict)
async def delete_service_page(slug: str, current_admin: dict = Depends(get_current_admin)):
    """Delete a specific service page"""
    try:
        result = await db.service_pages.delete_one({"slug": slug})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Service page not found")
        return {"message": "Service page deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting service page: {str(e)}")

# Public Service Pages Routes
@app.get("/api/services", response_model=List[dict])
async def get_public_service_pages():
    """Get all active service pages (public access)"""
    try:
        services = []
        async for service in db.service_pages.find({"is_active": True}):
            service["_id"] = str(service["_id"])
            services.append(service)
        return services
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching service pages: {str(e)}")

@app.get("/api/services/{slug}", response_model=dict)
async def get_public_service_page(slug: str):
    """Get a specific service page (public access)"""
    try:
        service = await db.service_pages.find_one({"slug": slug, "is_active": True})
        if not service:
            raise HTTPException(status_code=404, detail="Service page not found")
        service["_id"] = str(service["_id"])
        return service
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching service page: {str(e)}")

# Admin Dashboard Statistics
@app.get("/api/admin/dashboard/stats", response_model=dict)
async def get_dashboard_stats(current_admin: dict = Depends(get_current_admin)):
    """Get dashboard statistics"""
    try:
        # Get counts from various collections
        total_users = await db.users.count_documents({})
        total_contacts = await db.contacts.count_documents({})
        total_projects = await db.projects.count_documents({})
        total_calculations = await db.calculations.count_documents({})
        total_services = await db.service_pages.count_documents({})
        
        # Get recent activity
        recent_contacts = []
        async for contact in db.contacts.find().sort("created_at", -1).limit(5):
            contact["_id"] = str(contact["_id"])
            recent_contacts.append(contact)
        
        recent_calculations = []
        async for calc in db.calculations.find().sort("created_at", -1).limit(5):
            calc["_id"] = str(calc["_id"])
            recent_calculations.append(calc)
        
        return {
            "total_users": total_users,
            "total_contacts": total_contacts,
            "total_projects": total_projects,
            "total_calculations": total_calculations,
            "total_services": total_services,
            "recent_contacts": recent_contacts,
            "recent_calculations": recent_calculations
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching dashboard stats: {str(e)}")

# User Management Routes
@app.get("/api/admin/users", response_model=List[dict])
async def get_all_users(current_admin: dict = Depends(get_current_admin)):
    """Get all users"""
    try:
        users = []
        async for user in db.users.find():
            user["_id"] = str(user["_id"])
            # Don't return password hash
            if "hashed_password" in user:
                del user["hashed_password"]
            users.append(user)
        return users
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching users: {str(e)}")

@app.get("/api/admin/contacts", response_model=List[dict])
async def get_all_contacts(current_admin: dict = Depends(get_current_admin)):
    """Get all contact form submissions"""
    try:
        contacts = []
        async for contact in db.contacts.find():
            contact["_id"] = str(contact["_id"])
            contacts.append(contact)
        return contacts
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching contacts: {str(e)}")

@app.get("/api/admin/calculations", response_model=List[dict])
async def get_all_calculations(current_admin: dict = Depends(get_current_admin)):
    """Get all cost calculations"""
    try:
        calculations = []
        async for calc in db.calculations.find():
            calc["_id"] = str(calc["_id"])
            calculations.append(calc)
        return calculations
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching calculations: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)

# Initialize service pages data
async def initialize_service_pages():
    """Initialize service pages in the database"""
    service_pages_data = [
        {
            "slug": "painting-services",
            "title": "Professional Painting Services in Pune",
            "description": "Transform your space with our expert painting services. From interior to exterior, residential to commercial - we deliver quality results.",
            "content": """
            <div class="service-content">
                <h2>Professional Painting Services</h2>
                <p>Our expert painting team delivers exceptional results for both interior and exterior painting projects. We use premium quality paints and modern techniques to ensure long-lasting, beautiful finishes.</p>
                
                <h3>Our Painting Services Include:</h3>
                <ul>
                    <li>Interior Wall Painting</li>
                    <li>Exterior Wall Painting</li>
                    <li>Ceiling Painting</li>
                    <li>Texture Painting</li>
                    <li>Stencil and Decorative Painting</li>
                    <li>Wood and Metal Painting</li>
                    <li>Waterproofing with Paint</li>
                    <li>Color Consultation</li>
                </ul>
                
                <h3>Why Choose Our Painting Services?</h3>
                <ul>
                    <li>Skilled and experienced painters</li>
                    <li>Premium quality paints from trusted brands</li>
                    <li>Proper surface preparation</li>
                    <li>Clean and efficient work process</li>
                    <li>Competitive pricing</li>
                    <li>Warranty on workmanship</li>
                </ul>
            </div>
            """,
            "features": [
                "Interior & Exterior Painting",
                "Texture & Decorative Painting",
                "Premium Quality Paints",
                "Professional Color Consultation",
                "Surface Preparation",
                "Clean Work Process",
                "Warranty Included"
            ],
            "pricing_info": {
                "starting_price": 15,
                "unit": "per sq ft",
                "factors": [
                    "Surface condition",
                    "Paint quality",
                    "Number of coats",
                    "Complexity of work",
                    "Location accessibility"
                ]
            },
            "images": [
                "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&h=600&fit=crop"
            ],
            "seo_data": {
                "title": "Professional Painting Services in Pune | Interior & Exterior Painting",
                "description": "Get expert painting services in Pune for interior and exterior walls. Professional painters, quality paints, competitive pricing. Free consultation available.",
                "keywords": ["painting services pune", "interior painting", "exterior painting", "professional painters", "wall painting"]
            },
            "is_active": True
        },
        {
            "slug": "window-fitment-services",
            "title": "Window Fitment Services in Pune",
            "description": "Professional window installation and fitment services. UPVC windows, aluminum windows, wooden windows - expert installation with warranty.",
            "content": """
            <div class="service-content">
                <h2>Expert Window Fitment Services</h2>
                <p>Our skilled technicians provide professional window installation and fitment services for all types of windows. We ensure proper alignment, weatherproofing, and security for your windows.</p>
                
                <h3>Window Types We Handle:</h3>
                <ul>
                    <li>UPVC Windows</li>
                    <li>Aluminum Windows</li>
                    <li>Wooden Windows</li>
                    <li>Sliding Windows</li>
                    <li>Casement Windows</li>
                    <li>Fixed Windows</li>
                    <li>Bay Windows</li>
                    <li>French Windows</li>
                </ul>
                
                <h3>Our Services Include:</h3>
                <ul>
                    <li>Window measurement and consultation</li>
                    <li>Custom window manufacturing</li>
                    <li>Professional installation</li>
                    <li>Weatherproofing and sealing</li>
                    <li>Hardware installation</li>
                    <li>Quality testing</li>
                    <li>Post-installation support</li>
                </ul>
            </div>
            """,
            "features": [
                "UPVC, Aluminum & Wooden Windows",
                "Custom Manufacturing",
                "Professional Installation",
                "Weatherproofing",
                "Security Features",
                "Energy Efficient",
                "Warranty Included"
            ],
            "pricing_info": {
                "starting_price": 450,
                "unit": "per sq ft",
                "factors": [
                    "Window type and material",
                    "Size and complexity",
                    "Hardware quality",
                    "Installation complexity",
                    "Weatherproofing requirements"
                ]
            },
            "images": [
                "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1582030450248-87d1e9e4c7a6?w=800&h=600&fit=crop"
            ],
            "seo_data": {
                "title": "Window Fitment Services in Pune | UPVC & Aluminum Windows",
                "description": "Professional window fitment services in Pune. Expert installation of UPVC, aluminum, and wooden windows with warranty. Free consultation available.",
                "keywords": ["window fitment pune", "upvc windows", "aluminum windows", "window installation", "window replacement"]
            },
            "is_active": True
        },
        {
            "slug": "door-fitment-services",
            "title": "Door Fitment Services in Pune",
            "description": "Professional door installation services for all types of doors. Main doors, interior doors, sliding doors - expert fitment with security features.",
            "content": """
            <div class="service-content">
                <h2>Professional Door Fitment Services</h2>
                <p>Our experienced team provides comprehensive door installation services for residential and commercial properties. We ensure proper alignment, security, and functionality.</p>
                
                <h3>Door Types We Install:</h3>
                <ul>
                    <li>Main Entry Doors</li>
                    <li>Interior Doors</li>
                    <li>Sliding Doors</li>
                    <li>Folding Doors</li>
                    <li>French Doors</li>
                    <li>Security Doors</li>
                    <li>Fire-rated Doors</li>
                    <li>Bathroom Doors</li>
                </ul>
                
                <h3>Materials We Work With:</h3>
                <ul>
                    <li>Solid Wood Doors</li>
                    <li>Engineered Wood Doors</li>
                    <li>UPVC Doors</li>
                    <li>Aluminum Doors</li>
                    <li>Glass Doors</li>
                    <li>Steel Doors</li>
                    <li>Fiber Doors</li>
                </ul>
            </div>
            """,
            "features": [
                "All Door Types",
                "Multiple Materials",
                "Security Features",
                "Custom Sizing",
                "Professional Installation",
                "Hardware Installation",
                "Warranty Included"
            ],
            "pricing_info": {
                "starting_price": 5000,
                "unit": "per door",
                "factors": [
                    "Door type and material",
                    "Size and customization",
                    "Hardware quality",
                    "Installation complexity",
                    "Security features"
                ]
            },
            "images": [
                "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1562113530-57ba1cea3efe?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&h=600&fit=crop"
            ],
            "seo_data": {
                "title": "Door Fitment Services in Pune | Main Door & Interior Door Installation",
                "description": "Professional door fitment services in Pune for all types of doors. Expert installation, security features, and quality materials. Free consultation available.",
                "keywords": ["door fitment pune", "main door installation", "interior doors", "sliding doors", "door replacement"]
            },
            "is_active": True
        },
        {
            "slug": "rework-services",
            "title": "Rework Services in Pune",
            "description": "Quality rework and renovation services for construction projects. Fixing defects, improvements, and modifications with expert craftsmanship.",
            "content": """
            <div class="service-content">
                <h2>Professional Rework Services</h2>
                <p>Our skilled team specializes in rework and renovation services to fix defects, make improvements, and modify existing structures. We ensure quality results that meet your expectations.</p>
                
                <h3>Our Rework Services Include:</h3>
                <ul>
                    <li>Structural Repairs</li>
                    <li>Plumbing Rework</li>
                    <li>Electrical Rework</li>
                    <li>Painting Touch-ups</li>
                    <li>Tiling Repairs</li>
                    <li>Flooring Modifications</li>
                    <li>Wall Modifications</li>
                    <li>Ceiling Repairs</li>
                </ul>
                
                <h3>Common Rework Projects:</h3>
                <ul>
                    <li>Fixing construction defects</li>
                    <li>Bathroom renovations</li>
                    <li>Kitchen modifications</li>
                    <li>Room additions</li>
                    <li>Structural modifications</li>
                    <li>Quality improvements</li>
                    <li>Code compliance updates</li>
                </ul>
            </div>
            """,
            "features": [
                "Defect Rectification",
                "Quality Improvements",
                "Structural Modifications",
                "Multiple Trades",
                "Expert Craftsmanship",
                "Quick Turnaround",
                "Warranty on Work"
            ],
            "pricing_info": {
                "starting_price": 200,
                "unit": "per sq ft",
                "factors": [
                    "Scope of rework",
                    "Complexity of issues",
                    "Materials required",
                    "Time constraints",
                    "Structural modifications"
                ]
            },
            "images": [
                "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&h=600&fit=crop"
            ],
            "seo_data": {
                "title": "Rework Services in Pune | Construction Rework & Renovation",
                "description": "Professional rework services in Pune for construction defects, renovations, and improvements. Expert craftsmanship and quality results guaranteed.",
                "keywords": ["rework services pune", "construction rework", "renovation services", "building repairs", "structural modifications"]
            },
            "is_active": True
        },
        {
            "slug": "interior-design-services",
            "title": "Interior Design Services in Pune",
            "description": "Transform your space with our professional interior design services. Complete design solutions for homes and offices with modern aesthetics.",
            "content": """
            <div class="service-content">
                <h2>Professional Interior Design Services</h2>
                <p>Our creative interior designers work closely with you to create beautiful, functional spaces that reflect your style and meet your needs. From concept to completion, we handle every detail.</p>
                
                <h3>Our Interior Design Services:</h3>
                <ul>
                    <li>Complete Home Interior Design</li>
                    <li>Office Interior Design</li>
                    <li>Bedroom Design</li>
                    <li>Living Room Design</li>
                    <li>Kitchen Design</li>
                    <li>Bathroom Design</li>
                    <li>Modular Furniture Design</li>
                    <li>Lighting Design</li>
                </ul>
                
                <h3>Design Services Include:</h3>
                <ul>
                    <li>Space planning and layout</li>
                    <li>Color schemes and themes</li>
                    <li>Furniture selection and placement</li>
                    <li>Lighting design</li>
                    <li>Material and finish selection</li>
                    <li>Custom furniture design</li>
                    <li>3D visualization</li>
                    <li>Project management</li>
                </ul>
            </div>
            """,
            "features": [
                "Complete Design Solutions",
                "3D Visualization",
                "Custom Furniture",
                "Modern Aesthetics",
                "Space Optimization",
                "Project Management",
                "Warranty Included"
            ],
            "pricing_info": {
                "starting_price": 150,
                "unit": "per sq ft",
                "factors": [
                    "Design complexity",
                    "Material quality",
                    "Custom furniture",
                    "Project scope",
                    "Timeline requirements"
                ]
            },
            "images": [
                "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1582030450248-87d1e9e4c7a6?w=800&h=600&fit=crop"
            ],
            "seo_data": {
                "title": "Interior Design Services in Pune | Home & Office Interior Design",
                "description": "Professional interior design services in Pune for homes and offices. Modern designs, 3D visualization, and complete project management. Free consultation available.",
                "keywords": ["interior design pune", "home interior design", "office interior design", "interior decorator", "modular furniture"]
            },
            "is_active": True
        },
        {
            "slug": "tiles-fitment-services",
            "title": "Tiles Fitment Services in Pune",
            "description": "Professional tile installation services for all types of tiles. Floor tiles, wall tiles, bathroom tiles - expert fitment with precision.",
            "content": """
            <div class="service-content">
                <h2>Expert Tiles Fitment Services</h2>
                <p>Our skilled tile installers provide professional tile fitment services for residential and commercial properties. We ensure precise alignment, proper sealing, and long-lasting results.</p>
                
                <h3>Tile Types We Install:</h3>
                <ul>
                    <li>Vitrified Tiles</li>
                    <li>Ceramic Tiles</li>
                    <li>Marble Tiles</li>
                    <li>Granite Tiles</li>
                    <li>Porcelain Tiles</li>
                    <li>Mosaic Tiles</li>
                    <li>Natural Stone Tiles</li>
                    <li>Designer Tiles</li>
                </ul>
                
                <h3>Areas We Cover:</h3>
                <ul>
                    <li>Living Room Flooring</li>
                    <li>Bedroom Flooring</li>
                    <li>Kitchen Tiles</li>
                    <li>Bathroom Tiles</li>
                    <li>Balcony Tiles</li>
                    <li>Staircase Tiles</li>
                    <li>Wall Cladding</li>
                    <li>Outdoor Tiles</li>
                </ul>
            </div>
            """,
            "features": [
                "All Tile Types",
                "Precision Installation",
                "Waterproofing",
                "Quality Grouting",
                "Pattern Design",
                "Proper Alignment",
                "Warranty Included"
            ],
            "pricing_info": {
                "starting_price": 35,
                "unit": "per sq ft",
                "factors": [
                    "Tile type and quality",
                    "Size and complexity",
                    "Pattern requirements",
                    "Surface preparation",
                    "Waterproofing needs"
                ]
            },
            "images": [
                "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1562113530-57ba1cea3efe?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&h=600&fit=crop"
            ],
            "seo_data": {
                "title": "Tiles Fitment Services in Pune | Floor & Wall Tile Installation",
                "description": "Professional tiles fitment services in Pune for all types of tiles. Expert installation, precision work, and quality results. Free consultation available.",
                "keywords": ["tiles fitment pune", "tile installation", "floor tiles", "wall tiles", "bathroom tiles", "kitchen tiles"]
            },
            "is_active": True
        },
        {
            "slug": "kitchen-styling-services",
            "title": "Kitchen Styling Services in Pune",
            "description": "Transform your kitchen with our professional styling services. Modular kitchens, custom designs, and complete kitchen solutions.",
            "content": """
            <div class="service-content">
                <h2>Professional Kitchen Styling Services</h2>
                <p>Our kitchen design experts create beautiful, functional kitchens that combine style with practicality. From modular solutions to custom designs, we transform your cooking space.</p>
                
                <h3>Kitchen Styling Services:</h3>
                <ul>
                    <li>Modular Kitchen Design</li>
                    <li>Custom Kitchen Solutions</li>
                    <li>Kitchen Renovation</li>
                    <li>Cabinet Installation</li>
                    <li>Countertop Installation</li>
                    <li>Kitchen Appliance Integration</li>
                    <li>Backsplash Design</li>
                    <li>Storage Solutions</li>
                </ul>
                
                <h3>Features We Provide:</h3>
                <ul>
                    <li>Space-efficient designs</li>
                    <li>Premium materials</li>
                    <li>Modern hardware</li>
                    <li>Smart storage solutions</li>
                    <li>Appliance integration</li>
                    <li>Easy maintenance</li>
                    <li>Warranty on products</li>
                </ul>
            </div>
            """,
            "features": [
                "Modular Kitchens",
                "Custom Designs",
                "Space Optimization",
                "Premium Materials",
                "Smart Storage",
                "Appliance Integration",
                "Warranty Included"
            ],
            "pricing_info": {
                "starting_price": 1200,
                "unit": "per sq ft",
                "factors": [
                    "Kitchen size",
                    "Material quality",
                    "Design complexity",
                    "Appliance integration",
                    "Hardware quality"
                ]
            },
            "images": [
                "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1594736797933-d0cea80b1d55?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1561968098-4e99b1a5e6e7?w=800&h=600&fit=crop"
            ],
            "seo_data": {
                "title": "Kitchen Styling Services in Pune | Modular Kitchen Design",
                "description": "Professional kitchen styling services in Pune. Modular kitchens, custom designs, and complete kitchen solutions. Transform your cooking space today.",
                "keywords": ["kitchen styling pune", "modular kitchen", "kitchen design", "kitchen renovation", "custom kitchen"]
            },
            "is_active": True
        },
        {
            "slug": "plumbing-services",
            "title": "Plumbing Services in Pune",
            "description": "Professional plumbing services for all your water and drainage needs. Installation, repairs, and maintenance by skilled plumbers.",
            "content": """
            <div class="service-content">
                <h2>Professional Plumbing Services</h2>
                <p>Our certified plumbers provide comprehensive plumbing services for residential and commercial properties. From installations to emergency repairs, we handle all your plumbing needs.</p>
                
                <h3>Plumbing Services We Offer:</h3>
                <ul>
                    <li>Pipe Installation and Repair</li>
                    <li>Bathroom Plumbing</li>
                    <li>Kitchen Plumbing</li>
                    <li>Drainage Systems</li>
                    <li>Water Tank Installation</li>
                    <li>Faucet and Fixture Installation</li>
                    <li>Water Heater Services</li>
                    <li>Emergency Plumbing</li>
                </ul>
                
                <h3>Common Plumbing Issues We Fix:</h3>
                <ul>
                    <li>Leaky pipes and faucets</li>
                    <li>Blocked drains</li>
                    <li>Low water pressure</li>
                    <li>Running toilets</li>
                    <li>Water heater problems</li>
                    <li>Pipe bursts</li>
                    <li>Drainage issues</li>
                </ul>
            </div>
            """,
            "features": [
                "Complete Plumbing Solutions",
                "Emergency Services",
                "Skilled Plumbers",
                "Quality Materials",
                "Pipe Installation",
                "Drainage Systems",
                "Warranty on Work"
            ],
            "pricing_info": {
                "starting_price": 500,
                "unit": "per service",
                "factors": [
                    "Type of service",
                    "Complexity of issue",
                    "Materials required",
                    "Emergency service",
                    "Location accessibility"
                ]
            },
            "images": [
                "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1562113530-57ba1cea3efe?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&h=600&fit=crop"
            ],
            "seo_data": {
                "title": "Plumbing Services in Pune | Professional Plumber & Pipe Installation",
                "description": "Professional plumbing services in Pune for all your water and drainage needs. Emergency plumbing, installations, and repairs by skilled plumbers.",
                "keywords": ["plumbing services pune", "plumber pune", "pipe installation", "drainage systems", "emergency plumbing"]
            },
            "is_active": True
        },
        {
            "slug": "masonry-work-services",
            "title": "Masonry Work Services in Pune",
            "description": "Professional masonry services for all your construction needs. Skilled masons for brick work, stone work, and structural masonry.",
            "content": """
            <div class="service-content">
                <h2>Expert Masonry Work Services</h2>
                <p>Our skilled masons provide professional masonry services for residential and commercial construction projects. We specialize in brick work, stone work, and structural masonry.</p>
                
                <h3>Masonry Services We Provide:</h3>
                <ul>
                    <li>Brick Work and Masonry</li>
                    <li>Stone Work</li>
                    <li>Block Work</li>
                    <li>Plastering</li>
                    <li>Foundation Work</li>
                    <li>Retaining Walls</li>
                    <li>Chimney Construction</li>
                    <li>Repair and Restoration</li>
                </ul>
                
                <h3>Materials We Work With:</h3>
                <ul>
                    <li>Clay Bricks</li>
                    <li>Concrete Blocks</li>
                    <li>Natural Stone</li>
                    <li>Manufactured Stone</li>
                    <li>Cement Blocks</li>
                    <li>Fly Ash Bricks</li>
                    <li>Hollow Blocks</li>
                </ul>
            </div>
            """,
            "features": [
                "Skilled Masons",
                "Quality Materials",
                "Structural Work",
                "Brick & Stone Work",
                "Foundation Services",
                "Repair & Restoration",
                "Warranty on Work"
            ],
            "pricing_info": {
                "starting_price": 45,
                "unit": "per sq ft",
                "factors": [
                    "Type of masonry work",
                    "Material selection",
                    "Structural complexity",
                    "Height and access",
                    "Quality requirements"
                ]
            },
            "images": [
                "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&h=600&fit=crop"
            ],
            "seo_data": {
                "title": "Masonry Work Services in Pune | Brick Work & Stone Work",
                "description": "Professional masonry services in Pune by skilled masons. Brick work, stone work, plastering, and structural masonry. Quality workmanship guaranteed.",
                "keywords": ["masonry work pune", "brick work", "stone work", "masonry contractor", "structural masonry"]
            },
            "is_active": True
        },
        {
            "slug": "water-proofing-services",
            "title": "Water Proofing Services in Pune",
            "description": "Professional waterproofing services to protect your property from water damage. Terrace, bathroom, and basement waterproofing solutions.",
            "content": """
            <div class="service-content">
                <h2>Professional Water Proofing Services</h2>
                <p>Our waterproofing experts provide comprehensive solutions to protect your property from water damage. We use advanced materials and techniques for long-lasting results.</p>
                
                <h3>Waterproofing Services:</h3>
                <ul>
                    <li>Terrace Waterproofing</li>
                    <li>Bathroom Waterproofing</li>
                    <li>Basement Waterproofing</li>
                    <li>Roof Waterproofing</li>
                    <li>Wall Waterproofing</li>
                    <li>Balcony Waterproofing</li>
                    <li>Swimming Pool Waterproofing</li>
                    <li>Leak Repair Services</li>
                </ul>
                
                <h3>Waterproofing Solutions:</h3>
                <ul>
                    <li>Membrane waterproofing</li>
                    <li>Liquid waterproofing</li>
                    <li>Crystalline waterproofing</li>
                    <li>Injection waterproofing</li>
                    <li>Bituminous waterproofing</li>
                    <li>APP membrane systems</li>
                    <li>Polyurethane coatings</li>
                </ul>
            </div>
            """,
            "features": [
                "Complete Waterproofing",
                "Advanced Materials",
                "Leak Detection",
                "Long-lasting Solutions",
                "Expert Application",
                "Quality Assurance",
                "Warranty Included"
            ],
            "pricing_info": {
                "starting_price": 65,
                "unit": "per sq ft",
                "factors": [
                    "Area to be waterproofed",
                    "Type of waterproofing",
                    "Material quality",
                    "Surface condition",
                    "Accessibility"
                ]
            },
            "images": [
                "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1594736797933-d0cea80b1d55?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1561968098-4e99b1a5e6e7?w=800&h=600&fit=crop"
            ],
            "seo_data": {
                "title": "Water Proofing Services in Pune | Terrace & Bathroom Waterproofing",
                "description": "Professional waterproofing services in Pune for terrace, bathroom, and basement. Prevent water damage with expert waterproofing solutions.",
                "keywords": ["waterproofing pune", "terrace waterproofing", "bathroom waterproofing", "leak repair", "waterproofing contractor"]
            },
            "is_active": True
        },
        {
            "slug": "grills-guard-rail-fitment-services",
            "title": "Grills and Guard Rail Fitment Services in Pune",
            "description": "Professional installation of grills and guard rails for safety and security. Window grills, balcony grills, and safety rails installation.",
            "content": """
            <div class="service-content">
                <h2>Grills and Guard Rail Fitment Services</h2>
                <p>Our skilled technicians provide professional installation of grills and guard rails for enhanced safety and security. We offer custom designs and quality materials for long-lasting protection.</p>
                
                <h3>Grill Services We Provide:</h3>
                <ul>
                    <li>Window Grills</li>
                    <li>Balcony Grills</li>
                    <li>Staircase Railings</li>
                    <li>Gate Grills</li>
                    <li>Compound Wall Grills</li>
                    <li>Decorative Grills</li>
                    <li>Security Grills</li>
                    <li>Custom Grill Designs</li>
                </ul>
                
                <h3>Materials We Use:</h3>
                <ul>
                    <li>Mild Steel (MS)</li>
                    <li>Stainless Steel (SS)</li>
                    <li>Aluminum</li>
                    <li>Wrought Iron</li>
                    <li>Galvanized Steel</li>
                    <li>Powder Coated Steel</li>
                </ul>
            </div>
            """,
            "features": [
                "Custom Designs",
                "Quality Materials",
                "Safety & Security",
                "Professional Installation",
                "Corrosion Resistance",
                "Decorative Options",
                "Warranty Included"
            ],
            "pricing_info": {
                "starting_price": 180,
                "unit": "per sq ft",
                "factors": [
                    "Design complexity",
                    "Material type",
                    "Size and dimensions",
                    "Installation location",
                    "Custom requirements"
                ]
            },
            "images": [
                "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1562113530-57ba1cea3efe?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&h=600&fit=crop"
            ],
            "seo_data": {
                "title": "Grills & Guard Rail Fitment Services in Pune | Window & Balcony Grills",
                "description": "Professional grills and guard rail fitment services in Pune. Custom window grills, balcony grills, and safety railings installation.",
                "keywords": ["grills fitment pune", "window grills", "balcony grills", "guard rails", "safety railings", "grill installation"]
            },
            "is_active": True
        }
    ]
    
    # Check if service pages already exist
    existing_count = await db.service_pages.count_documents({})
    if existing_count == 0:
        # Insert service pages
        for service_data in service_pages_data:
            service_data["created_at"] = datetime.now()
            service_data["updated_at"] = datetime.now()
            await db.service_pages.insert_one(service_data)
        print(f"Initialized {len(service_pages_data)} service pages")
    else:
        print(f"Service pages already exist ({existing_count} found)")

# Initialize service pages on startup
@app.on_event("startup")
async def startup_event():
    await initialize_service_pages()