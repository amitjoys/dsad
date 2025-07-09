from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta, datetime
import uuid
from models import UserCreate, UserLogin, Token, AdminUserCreate
from database import users_collection, admins_collection
from auth import (
    verify_password, 
    get_password_hash, 
    create_access_token, 
    get_current_user, 
    get_current_admin,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

router = APIRouter()

# User Authentication Routes
@router.post("/register", response_model=dict)
async def register(user: UserCreate):
    """Register a new user"""
    try:
        # Check if user already exists
        existing_user = await users_collection.find_one({"email": user.email})
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
        
        result = await users_collection.insert_one(user_dict)
        return {"message": "User registered successfully", "id": str(result.inserted_id)}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error registering user: {str(e)}")

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login user"""
    try:
        user = await users_collection.find_one({"email": form_data.username})
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

@router.get("/me", response_model=dict)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current user info"""
    current_user["_id"] = str(current_user["_id"])
    return current_user

# Admin Authentication Routes
@router.post("/admin/register", response_model=dict)
async def register_admin(admin: AdminUserCreate):
    """Register a new admin user"""
    try:
        # Check if admin already exists
        existing_admin = await admins_collection.find_one({"email": admin.email})
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
        
        result = await admins_collection.insert_one(admin_dict)
        return {"message": "Admin registered successfully", "id": str(result.inserted_id)}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error registering admin: {str(e)}")

@router.post("/admin/login", response_model=Token)
async def login_admin(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login admin user"""
    try:
        admin = await admins_collection.find_one({"email": form_data.username})
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

@router.get("/admin/me", response_model=dict)
async def get_current_admin_info(current_admin: dict = Depends(get_current_admin)):
    """Get current admin info"""
    current_admin["_id"] = str(current_admin["_id"])
    return current_admin