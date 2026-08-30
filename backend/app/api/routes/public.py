from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db
from app.models.domain import ProblemDomain
from app.models.standardized_problem import ProblemStatus
from app.schemas.public import PublicAnalyticsResponse, PublicProblemListResponse
from app.services.public_service import PublicService

router = APIRouter()


@router.get(
    "/problems",
    response_model=PublicProblemListResponse,
    status_code=status.HTTP_200_OK,
    summary="Public Societal Problems",
    description="Public feed of standardized societal problems and status. Zero citizen PII is exposed.",
)
async def get_public_problems(
    domain: Optional[ProblemDomain] = Query(None, description="Filter by problem domain"),
    latitude: Optional[float] = Query(None, ge=-90.0, le=90.0, description="Center latitude for distance filter"),
    longitude: Optional[float] = Query(None, ge=-180.0, le=180.0, description="Center longitude for distance filter"),
    radius_km: Optional[float] = Query(None, ge=1.0, le=100.0, description="Radius in km (default 25, max 100)"),
    status: Optional[ProblemStatus] = Query(None, description="Problem status filter"),
    limit: int = Query(20, ge=1, le=50, description="Pagination limit (max: 50)"),
    offset: int = Query(0, ge=0, description="Pagination offset"),
    db: AsyncSession = Depends(get_db),
) -> PublicProblemListResponse:
    domain_val = domain.value if domain is not None else None
    return await PublicService.get_public_problems(
        db=db,
        domain=domain_val,
        latitude=latitude,
        longitude=longitude,
        radius_km=radius_km,
        status=status,
        limit=limit,
        offset=offset,
    )


@router.get(
    "/analytics",
    response_model=PublicAnalyticsResponse,
    status_code=status.HTTP_200_OK,
    summary="Public Impact Analytics",
    description="High-level public analytics on societal problems, reports, teams, and industry solutions.",
)
async def get_public_analytics(
    db: AsyncSession = Depends(get_db),
) -> PublicAnalyticsResponse:
    return await PublicService.get_public_analytics(db=db)
