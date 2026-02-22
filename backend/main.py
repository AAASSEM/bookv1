from fastapi import FastAPI, HTTPException  # Import main FastAPI class
from fastapi.middleware.cors import CORSMiddleware  # Import CORS middleware for handling cross-origin requests
import os
from .database import create_db_and_tables  # Import DB initialization function
from .routers import users, activities, assessments, dashboard, notifications, auth  # Import specific API routers

# Initialize the FastAPI application with a custom title
app = FastAPI(title="BrightBook API")

# Define a startup event handler
@app.on_event("startup")
def on_startup():
    # Create database tables when the application starts
    create_db_and_tables()

# Configure Middleware to allow the frontend to access the API
# Get allowed origins from environment variable or use defaults
import os
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")
if allowed_origins_env:
    allowed_origins = allowed_origins_env.split(",")
else:
    allowed_origins = ["http://localhost:5173"]

print(f"🔴 ALLOWED_ORIGINS: {allowed_origins}")

app.add_middleware(
    CORSMiddleware,
    # Allow requests from production URL and local development
    allow_origins=allowed_origins,
    # Allow credentials like cookies (if needed in future)
    allow_credentials=True,
    # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_methods=["*"],
    # Allow all HTTP headers
    allow_headers=["*"],
)

# Register the users router (endpoints under /users)
app.include_router(users.router)
# Register the activities router (endpoints under /activities)
app.include_router(activities.router)
# Register the assessments router (endpoints under /assessments)
app.include_router(assessments.router)
# Register the dashboard router (endpoints under /dashboard)
app.include_router(dashboard.router)
# Register the notifications router
app.include_router(notifications.router)
# Register the auth router
app.include_router(auth.router)

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "BrightBook API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
        "endpoints": {
            "users": "/users",
            "activities": "/activities",
            "assessments": "/assessments",
            "dashboard": "/dashboard",
            "notifications": "/notifications",
            "auth": "/auth"
        }
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}
