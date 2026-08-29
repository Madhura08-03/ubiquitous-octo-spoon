from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db
from app.models.domain import ProblemDomain
from app.models.standardized_problem import ProblemStatus
from app.schemas.problem import ProblemListResponse
from app.services.problem_service import ProblemService

router = APIRouter()


@router.get(
    "",
    response_model=ProblemListResponse,
    status_code=status.HTTP_200_OK,
    summary="List standardized societal problems",
    description=(
        "Student discovery feed for standardized problems. "
        "Supports filtering by domain, geographic radius (Haversine), minimum priority score, and status. "
        "Zero citizen PII is exposed."
    ),
)
async def get_standardized_problems(
    domain: Optional[ProblemDomain] = Query(None, description="Filter by citizen-selected domain"),
    latitude: Optional[float] = Query(None, ge=-90.0, le=90.0, description="Center latitude for distance filtering"),
    longitude: Optional[float] = Query(None, ge=-180.0, le=180.0, description="Center longitude for distance filtering"),
    radius_km: Optional[float] = Query(None, ge=1.0, le=100.0, description="Search radius in kilometers (default: 25 km, max: 100 km)"),
    min_priority_score: Optional[float] = Query(None, ge=0.0, le=100.0, description="Minimum priority score (0-100)"),
    status: Optional[ProblemStatus] = Query(None, description="Problem status (defaults to OPEN & UNDER_INVESTIGATION)"),
    limit: int = Query(20, ge=1, le=50, description="Pagination limit (max: 50)"),
    offset: int = Query(0, ge=0, description="Pagination offset"),
    db: AsyncSession = Depends(get_db),
) -> ProblemListResponse:
    domain_val = domain.value if domain is not None else None
    return await ProblemService.list_problems(
        db=db,
        domain=domain_val,
        latitude=latitude,
        longitude=longitude,
        radius_km=radius_km,
        min_priority_score=min_priority_score,
        status=status,
        limit=limit,
        offset=offset,
    )
