from fastapi import FastAPI, HTTPException  # Import main FastAPI class
from fastapi.middleware.cors import CORSMiddleware  # Import CORS middleware for handling cross-origin requests
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
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
app.add_middleware(
    CORSMiddleware,
    # Allow requests from the local Vite development server
    allow_origins=["http://localhost:5173"],
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

# Serve React App
# Check if dist exists (it should after build)
if os.path.isdir("dist"):
    app.mount("/assets", StaticFiles(directory="dist/assets"), name="assets")

    @app.get("/{full_path:path}")
    async def catch_all(full_path: str):
        # Allow API requests to pass through (handled by routers above)
        if full_path.startswith("api"):
            # This shouldn't happen if routers are matched first, but good safety
             raise HTTPException(status_code=404, detail="API route not found")
        
        # Serve index.html for any other route (SPA)
        return FileResponse("dist/index.html")

    # Explicit root handler if catch_all doesn't match empty
    @app.get("/")
    async def serve_root():
        return FileResponse("dist/index.html")
else:
    print("Warning: 'dist' directory not found. Frontend will not be served.")
