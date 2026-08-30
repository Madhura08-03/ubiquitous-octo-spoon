import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.models.user import UserRole


class UserPublic(BaseModel):
    id: uuid.UUID
    email: str
    full_name: str
    role: UserRole
    is_verified: bool
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
