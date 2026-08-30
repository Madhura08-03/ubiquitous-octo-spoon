import uuid
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict
from app.models.standardized_problem import ProblemStatus


class PublicProblemResponse(BaseModel):
    id: uuid.UUID
    title: str
    domain: str
    problem_summary: str
    observed_impact: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    priority_score: float
    report_count: int
    evidence_count: int
    status: ProblemStatus
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PublicProblemListResponse(BaseModel):
    items: List[PublicProblemResponse]
    total: int
    limit: int
    offset: int


class DomainAnalyticsItem(BaseModel):
    domain: str
    problem_count: int
    report_count: int


class PublicAnalyticsResponse(BaseModel):
    total_problems: int
    total_reports: int
    open_problems: int
    in_progress_problems: int
    resolved_problems: int
    total_evidence_items: int
    total_teams: int
    total_solutions: int
    industry_approved_solutions: int
    approved_prototypes: int
    domain_breakdown: List[DomainAnalyticsItem]
