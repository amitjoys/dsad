#!/usr/bin/env python3
"""
ConstructPune API Server
======================

This is the main entry point for the ConstructPune API server.
The server has been refactored into multiple modules for better maintainability:

- models.py: Pydantic models for data validation
- database.py: Database connection and operations
- auth.py: Authentication utilities
- cost_calculator.py: Cost calculation business logic
- seo_utils.py: SEO optimization utilities
- service_pages_data.py: Service pages initialization
- routes/: API route handlers organized by domain
- config.py: Configuration settings
- main.py: Main FastAPI application

For development, run: python server.py
For production, use: uvicorn main:app --host 0.0.0.0 --port 8001
"""

from main import app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)