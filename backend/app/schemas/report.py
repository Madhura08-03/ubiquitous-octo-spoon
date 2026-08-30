import uuid
from typing import Optional
from pydantic import BaseModel, Field, HttpUrl, field_validator
from app.models.domain import ProblemDomain
from app.models.raw_report import RawReportStatus


class ReportCreate(BaseModel):
    description: str = Field(..., min_length=20, max_length=3000)
    domain: ProblemDomain
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    title: Optional[str] = Field(default=None, max_length=150)
    photo_url: Optional[str] = Field(default=None, max_length=500)

    @field_validator("description")
    @classmethod
    def validate_description(cls, v: str) -> str:
        trimmed = v.strip()
        if len(trimmed) < 20:
            raise ValueError("Description must contain at least 20 characters after trimming.")
        if len(trimmed) > 3000:
            raise ValueError("Description cannot exceed 3000 characters.")
        return trimmed

    @field_validator("title")
    @classmethod
    def validate_title(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            trimmed = v.strip()
            if not trimmed:
                return None
            return trimmed[:150]
        return None

    @field_validator("photo_url")
    @classmethod
    def validate_photo_url(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            trimmed = v.strip()
            if not trimmed:
                return None
            if not (trimmed.startswith("http://") or trimmed.startswith("https://")):
                raise ValueError("photo_url must be a valid HTTP or HTTPS URL.")
            return trimmed
        return None


class ReportResponse(BaseModel):
    report_id: uuid.UUID
    status: RawReportStatus
    processing_status: str = "STUB"
    message: str = "Your problem report has been received."
