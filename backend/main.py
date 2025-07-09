from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import ALLOWED_ORIGINS, ALLOWED_METHODS, ALLOWED_HEADERS, ALLOW_CREDENTIALS
from routes.auth_routes import router as auth_router
from routes.calculator_routes import router as calculator_router
from service_pages_data import initialize_service_pages
from database import (
    contacts_collection,
    projects_collection,
    service_pages_collection,
    seo_data_collection,
    users_collection,
    admins_collection,
    calculations_collection
)
from models import ContactForm, Project, ServicePage, SEOData, SEOOptimizationRequest
from auth import get_current_admin
from seo_utils import mock_groq_seo_optimization, generate_seo_audit
from fastapi import HTTPException, Depends
from typing import List
from datetime import datetime

app = FastAPI(title="ConstructPune API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=ALLOW_CREDENTIALS,
    allow_methods=ALLOWED_METHODS,
    allow_headers=ALLOWED_HEADERS
)

# Include routers
app.include_router(auth_router, prefix="/api/auth", tags=["authentication"])
app.include_router(calculator_router, prefix="/api/calculator", tags=["calculator"])

# Basic routes
@app.get("/api/")
async def root():
    return {"message": "ConstructPune API is running!"}

@app.post("/api/contact", response_model=dict)
async def submit_contact_form(contact: ContactForm):
    """Submit contact form"""
    try:
        contact_dict = contact.model_dump()
        result = await contacts_collection.insert_one(contact_dict)
        return {"message": "Contact form submitted successfully", "id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error submitting contact form: {str(e)}")

@app.get("/api/projects", response_model=List[dict])
async def get_projects():
    """Get all projects"""
    try:
        projects = []
        async for project in projects_collection.find():
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
        result = await projects_collection.insert_one(project_dict)
        return {"message": "Project created successfully", "id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating project: {str(e)}")

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
        await seo_data_collection.update_one(
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

# Service Pages Management Routes
@app.post("/api/admin/services", response_model=dict)
async def create_service_page(service: ServicePage, current_admin: dict = Depends(get_current_admin)):
    """Create a new service page"""
    try:
        service_dict = service.model_dump()
        result = await service_pages_collection.insert_one(service_dict)
        return {"message": "Service page created successfully", "id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating service page: {str(e)}")

@app.get("/api/admin/services", response_model=List[dict])
async def get_all_service_pages(current_admin: dict = Depends(get_current_admin)):
    """Get all service pages"""
    try:
        services = []
        async for service in service_pages_collection.find():
            service["_id"] = str(service["_id"])
            services.append(service)
        return services
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching service pages: {str(e)}")

@app.get("/api/services", response_model=List[dict])
async def get_public_service_pages():
    """Get all active service pages (public access)"""
    try:
        services = []
        async for service in service_pages_collection.find({"is_active": True}):
            service["_id"] = str(service["_id"])
            services.append(service)
        return services
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching service pages: {str(e)}")

@app.get("/api/services/{slug}", response_model=dict)
async def get_public_service_page(slug: str):
    """Get a specific service page (public access)"""
    try:
        service = await service_pages_collection.find_one({"slug": slug, "is_active": True})
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
        total_users = await users_collection.count_documents({})
        total_contacts = await contacts_collection.count_documents({})
        total_projects = await projects_collection.count_documents({})
        total_calculations = await calculations_collection.count_documents({})
        total_services = await service_pages_collection.count_documents({})
        
        # Get recent activity
        recent_contacts = []
        async for contact in contacts_collection.find().sort("created_at", -1).limit(5):
            contact["_id"] = str(contact["_id"])
            recent_contacts.append(contact)
        
        recent_calculations = []
        async for calc in calculations_collection.find().sort("created_at", -1).limit(5):
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
        async for user in users_collection.find():
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
        async for contact in contacts_collection.find():
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
        async for calc in calculations_collection.find():
            calc["_id"] = str(calc["_id"])
            calculations.append(calc)
        return calculations
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching calculations: {str(e)}")

# Initialize service pages on startup
@app.on_event("startup")
async def startup_event():
    await initialize_service_pages()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)