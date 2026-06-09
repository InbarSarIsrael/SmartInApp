from datetime import datetime

from pydantic import BaseModel


class ProjectCreateRequest(BaseModel):
    project_name: str

class PortalLoginRequest(BaseModel):
    api_key: str

class MessageCreateRequest(BaseModel):
    project_id: int
    title: str
    content: str
    type: str
    placement: str
    button_text: str | None = None
    action_target: str | None = None
    target_audience: str | None = "ALL"
    start_date: datetime | None = None
    end_date: datetime | None = None

class MessageUpdateRequest(BaseModel):
    title: str | None = None
    content: str | None = None
    type: str | None = None
    placement: str | None = None
    button_text: str | None = None
    action_target: str | None = None
    target_audience: str | None = None
    enabled: bool | None = None
    start_date: datetime | None = None
    end_date: datetime | None = None

class MessageEnabledRequest(BaseModel):
    enabled: bool


class AnalyticsEventRequest(BaseModel):
    message_id: int