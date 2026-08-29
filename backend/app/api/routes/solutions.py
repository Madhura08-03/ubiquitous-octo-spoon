import uuid
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db, require_roles
from app.models.user import User, UserRole
from app.schemas.solution import (
    IndustryReviewCreate,
    IndustryReviewResponse,
    SolutionCreate,
    SolutionResponse,
)
from app.services.solution_service import SolutionService

router = APIRouter()


@router.post(
    "",
    response_model=SolutionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Propose a solution for an adopted problem",
    description="Allows authenticated and verified UNIVERSITY mentors to propose a technical solution for their team.",
)
async def create_solution(
    payload: SolutionCreate,
    current_user: User = Depends(require_roles(UserRole.UNIVERSITY)),
    db: AsyncSession = Depends(get_db),
) -> SolutionResponse:
    return await SolutionService.create_solution(
        db=db,
        current_user=current_user,
        payload=payload,
    )


@router.post(
    "/{solution_id}/industry-review",
    response_model=IndustryReviewResponse,
    status_code=status.HTTP_200_OK,
    summary="Review a proposed solution",
    description="Allows verified INDUSTRY users to approve, request changes, or reject a submitted solution.",
)
async def review_solution(
    solution_id: uuid.UUID,
    payload: IndustryReviewCreate,
    current_user: User = Depends(require_roles(UserRole.INDUSTRY)),
    db: AsyncSession = Depends(get_db),
) -> IndustryReviewResponse:
    return await SolutionService.review_solution(
        db=db,
        current_user=current_user,
        solution_id=solution_id,
        payload=payload,
    )
