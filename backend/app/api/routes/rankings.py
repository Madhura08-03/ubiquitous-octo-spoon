from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db
from app.schemas.rankings import IndustryRankingResponse, UniversityRankingResponse
from app.services.ranking_service import RankingService

router = APIRouter()


@router.get(
    "/universities",
    response_model=UniversityRankingResponse,
    status_code=status.HTTP_200_OK,
    summary="University Leaderboard",
    description="Public leaderboard displaying university mentors ranked by cumulative verified points.",
)
async def get_university_rankings(
    limit: int = Query(20, ge=1, le=50, description="Pagination limit (max: 50)"),
    offset: int = Query(0, ge=0, description="Pagination offset"),
    db: AsyncSession = Depends(get_db),
) -> UniversityRankingResponse:
    return await RankingService.get_university_rankings(db=db, limit=limit, offset=offset)


@router.get(
    "/industry",
    response_model=IndustryRankingResponse,
    status_code=status.HTTP_200_OK,
    summary="Industry Leaderboard",
    description="Public leaderboard displaying industry partners ranked by cumulative verified contribution points.",
)
async def get_industry_rankings(
    limit: int = Query(20, ge=1, le=50, description="Pagination limit (max: 50)"),
    offset: int = Query(0, ge=0, description="Pagination offset"),
    db: AsyncSession = Depends(get_db),
) -> IndustryRankingResponse:
    return await RankingService.get_industry_rankings(db=db, limit=limit, offset=offset)
