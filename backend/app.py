from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from core.connection import initialize_database
from routes.analytics import router as analytics_router
from routes.messages import router as messages_router
from routes.projects import router as projects_router
from services.messages import get_messages_by_project
from services.projects import get_project_by_api_key

# Runs database setup when the FastAPI app starts.
@asynccontextmanager
async def lifespan(app: FastAPI):
    initialize_database()
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Project endpoints
app.include_router(projects_router)

# Message endpoints
app.include_router(messages_router)

# Analytics endpoints
app.include_router(analytics_router)

# Home endpoints
# Returns a simple health response for the backend root route.
@app.get("/")
def home():
    return {"message": "SmartInApp backend is running"}

# SDK endpoint
# Returns active SDK messages for a project API key and optional placement.
@app.get("/sdk/messages")
def get_messages(api_key: str, placement: str | None = None):
    project = get_project_by_api_key(api_key)

    if not project:
        raise HTTPException(status_code=401, detail="Invalid API Key")

    messages = get_messages_by_project(project[0], placement)

    return {
        "project_name": project[1],
        "messages": messages
    }
