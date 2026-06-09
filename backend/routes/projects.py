from fastapi import APIRouter, HTTPException

from models import PortalLoginRequest, ProjectCreateRequest
from services.projects import create_project, get_project_by_api_key

router = APIRouter()

# Creates a project from the portal.
@router.post("/projects")
def add_project(request: ProjectCreateRequest):
    if request.project_name.strip() == "":
        raise HTTPException(status_code=400, detail="project_name cannot be empty")

    project = create_project(request.project_name)

    return {
        "status": "success",
        "project": project
    }

# Authenticates the portal by API key and returns project data.
@router.post("/portal/login")
def portal_login(request: PortalLoginRequest):
    if request.api_key.strip() == "":
        raise HTTPException(status_code=400, detail="api_key cannot be empty")

    project = get_project_by_api_key(request.api_key)

    if not project:
        raise HTTPException(status_code=401, detail="Invalid API key")

    return {
        "status": "success",
        "project": {
            "project_id": project[0],
            "project_name": project[1]
        }
    }
