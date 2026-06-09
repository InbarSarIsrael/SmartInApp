from fastapi import APIRouter

from models import AnalyticsEventRequest
from services.analytics import (
    get_analytics_summary,
    get_project_analytics_summary,
    get_project_ctr_over_time,
    get_top_messages_by_ctr,
    save_analytics_event,
)

router = APIRouter()

# Tracks that a message was viewed.
@router.post("/analytics/view")
def track_view(request: AnalyticsEventRequest):
    save_analytics_event(
        request.message_id,
        "VIEW"
    )

    return {
        "status": "success"
    }

# Tracks that a message CTA was clicked.
@router.post("/analytics/click")
def track_click(request: AnalyticsEventRequest):
    save_analytics_event(
        request.message_id,
        "CLICK"
    )

    return {
        "status": "success"
    }

# Tracks that a message was dismissed.
@router.post("/analytics/dismiss")
def track_dismiss(request: AnalyticsEventRequest):
    save_analytics_event(
        request.message_id,
        "DISMISS"
    )

    return {
        "status": "success"
    }

# Returns the best-performing messages by CTR for a project.
@router.get("/analytics/project/{project_id}/top-messages")
def top_messages_by_ctr(project_id: int):
    messages = get_top_messages_by_ctr(project_id)

    return {
        "project_id": project_id,
        "messages": messages
    }

# Returns project CTR data grouped by date.
@router.get("/analytics/project/{project_id}/ctr-over-time")
def project_ctr_over_time(project_id: int):
    points = get_project_ctr_over_time(project_id)

    return {
        "project_id": project_id,
        "points": points
    }

# Returns total analytics counts for a project.
@router.get("/analytics/project/{project_id}")
def project_analytics_summary(project_id: int):
    summary = get_project_analytics_summary(project_id)

    return summary

# Returns analytics counts for one message.
@router.get("/analytics/{message_id}")
def analytics_summary(message_id: int):
    summary = get_analytics_summary(message_id)

    return summary
