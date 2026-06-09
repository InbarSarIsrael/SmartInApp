from fastapi import APIRouter, HTTPException

from models import MessageCreateRequest, MessageEnabledRequest, MessageUpdateRequest
from services.messages import (
    create_message,
    delete_message,
    get_all_messages_by_project,
    get_project_messages_status_summary,
    update_message,
    update_message_enabled,
)

router = APIRouter()

# Returns all messages for a project in the portal.
@router.get("/messages/project/{project_id}")
def get_project_messages(project_id: int):
    messages = get_all_messages_by_project(project_id)

    return {
        "project_id": project_id,
        "messages": messages
    }

# Returns a summary of message statuses for a project.
@router.get("/messages/project/{project_id}/status-summary")
def get_project_messages_status(project_id: int):
    summary = get_project_messages_status_summary(project_id)

    return summary

# Creates a new message after validating required fields.
@router.post("/messages")
def add_message(request: MessageCreateRequest):
    if request.title.strip() == "":
        raise HTTPException(status_code=400, detail="title cannot be empty")

    if request.content.strip() == "":
        raise HTTPException(status_code=400, detail="content cannot be empty")

    if request.placement.strip() == "":
        raise HTTPException(status_code=400, detail="placement cannot be empty")

    if request.type not in ["DIALOG", "BANNER"]:
        raise HTTPException(status_code=400, detail="type must be DIALOG or BANNER")

    if (
            request.start_date is not None
            and request.end_date is not None
            and request.end_date <= request.start_date
    ):
        raise HTTPException(status_code=400, detail="end_date must be after start_date")

    new_message_id = create_message(request)

    return {
        "status": "success",
        "message_id": new_message_id
    }

# Updates an existing message after validating changed fields.
@router.patch("/messages/{message_id}")
def edit_message(message_id: int, request: MessageUpdateRequest):
    if request.title is not None and request.title.strip() == "":
        raise HTTPException(status_code=400, detail="title cannot be empty")

    if request.content is not None and request.content.strip() == "":
        raise HTTPException(status_code=400, detail="content cannot be empty")

    if request.placement is not None and request.placement.strip() == "":
        raise HTTPException(status_code=400, detail="placement cannot be empty")

    if request.type is not None and request.type not in ["DIALOG", "BANNER"]:
        raise HTTPException(status_code=400, detail="type must be DIALOG or BANNER")

    if (
            request.start_date is not None
            and request.end_date is not None
            and request.end_date <= request.start_date
    ):
        raise HTTPException(status_code=400, detail="end_date must be after start_date")

    updated_message = update_message(message_id, request)

    if not updated_message:
        raise HTTPException(status_code=404, detail="Message not found or no fields to update")

    return {
        "status": "success",
        "message_id": updated_message[0]
    }

# Enables or disables a message.
@router.patch("/messages/{message_id}/enabled")
def set_message_enabled(message_id: int, request: MessageEnabledRequest):
    updated_message = update_message_enabled(
        message_id,
        request.enabled
    )

    if not updated_message:
        raise HTTPException(status_code=404, detail="Message not found")

    return {
        "status": "success",
        "message_id": updated_message[0],
        "enabled": request.enabled
    }

# Deletes a message by id.
@router.delete("/messages/{message_id}")
def remove_message(message_id: int):
    deleted_message = delete_message(message_id)

    if not deleted_message:
        raise HTTPException(status_code=404, detail="Message not found")

    return {
        "status": "success",
        "message_id": deleted_message[0]
    }
