import uuid
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict
from app.models.standardized_problem import ProblemStatus


class ProblemRead(BaseModel):
    id: uuid.UUID
    title: str
    domain: str
    problem_summary: str
    affected_community: Optional[str] = None
    observed_impact: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    priority_score: float
    report_count: int
    evidence_count: int
    status: ProblemStatus
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProblemListResponse(BaseModel):
    items: List[ProblemRead]
    total: int
    limit: int
    offset: int
