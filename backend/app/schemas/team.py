import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator
from app.models.team import TeamStatus


class TeamCreate(BaseModel):
    problem_id: uuid.UUID
    name: str = Field(..., min_length=2, max_length=100)

    model_config = ConfigDict(extra="forbid")

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        trimmed = v.strip()
        if len(trimmed) < 2:
            raise ValueError("Team name must contain at least 2 characters after trimming.")
        if len(trimmed) > 100:
            raise ValueError("Team name cannot exceed 100 characters.")
        return trimmed


class TeamResponse(BaseModel):
    team_id: uuid.UUID
    problem_id: uuid.UUID
    university_id: Optional[uuid.UUID]
    mentor_id: Optional[uuid.UUID]
    name: str
    status: TeamStatus
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TeamMemberCreate(BaseModel):
    student_id: uuid.UUID
    role_in_team: Optional[str] = Field(default="Member", max_length=100)

    model_config = ConfigDict(extra="forbid")


class TeamMemberResponse(BaseModel):
    team_member_id: uuid.UUID
    team_id: uuid.UUID
    student_id: uuid.UUID
    role_in_team: Optional[str]
    team_status: TeamStatus
    joined_at: datetime

    model_config = ConfigDict(from_attributes=True)
