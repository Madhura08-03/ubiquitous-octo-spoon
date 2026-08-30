from datetime import datetime
from enum import Enum as PyEnum
import uuid
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator
from app.models.solution import IndustryReviewStatus, SolutionStatus


class IndustryReviewDecision(str, PyEnum):
    APPROVE = "APPROVE"
    NEEDS_CHANGES = "NEEDS_CHANGES"
    REJECT = "REJECT"


class SolutionCreate(BaseModel):
    team_id: uuid.UUID
    title: str = Field(..., min_length=5, max_length=255)
    description: str = Field(..., min_length=20, max_length=5000)

    model_config = ConfigDict(extra="forbid")

    @field_validator("title", "description")
    @classmethod
    def strip_whitespace(cls, v: str) -> str:
        trimmed = v.strip()
        if not trimmed:
            raise ValueError("Field cannot be blank.")
        return trimmed


class SolutionResponse(BaseModel):
    solution_id: uuid.UUID
    problem_id: uuid.UUID
    team_id: uuid.UUID
    proposed_by: uuid.UUID
    title: str
    description: str
    status: SolutionStatus
    industry_review_status: IndustryReviewStatus
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class IndustryReviewCreate(BaseModel):
    decision: IndustryReviewDecision
    review_comment: Optional[str] = Field(default=None, max_length=2000)

    model_config = ConfigDict(extra="forbid")

    @field_validator("review_comment")
    @classmethod
    def validate_comment(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            trimmed = v.strip()
            return trimmed if trimmed else None
        return None


class IndustryReviewResponse(BaseModel):
    solution_id: uuid.UUID
    status: SolutionStatus
    industry_review_status: IndustryReviewStatus
    decision: IndustryReviewDecision

    model_config = ConfigDict(from_attributes=True)
