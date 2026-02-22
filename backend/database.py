from sqlmodel import SQLModel, create_engine, Session  # Import SQLModel components for database connection
import os

# Define the database directory and file
# Use persistent disk location on Render, fallback to local directory
database_dir = os.getenv("DATABASE_DIR", "/opt/render/project/data")

print(f"🔴 Database directory: {database_dir}")

try:
    os.makedirs(database_dir, exist_ok=True)
    print(f"🔴 Database directory created/verified")
except Exception as e:
    print(f"🔴 Error creating database directory: {e}")
    # Fallback to current directory
    database_dir = "."
    os.makedirs(database_dir, exist_ok=True)

sqlite_file_name = os.path.join(database_dir, "database.db")
# Create the full connection URL string for SQLite
sqlite_url = f"sqlite:///{sqlite_file_name}"

print(f"🔴 Database file: {sqlite_file_name}")
print(f"🔴 Database URL: {sqlite_url}")

# Argument to allow check_same_thread=False, needed for SQLite with FastAPI
connect_args = {"check_same_thread": False}
# Create the database engine. echo=True logs all SQL commands to console
engine = create_engine(sqlite_url, echo=True, connect_args=connect_args)

# Function to create database tables based on defined models
def create_db_and_tables():
    # Will create tables for all models inheriting from SQLModel
    SQLModel.metadata.create_all(engine)

# Dependency generator to provide a database session
def get_session():
    # Create a new session using the engine
    with Session(engine) as session:
        # Yield the session to the requester (e.g., API endpoint)
        yield session
