from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid

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