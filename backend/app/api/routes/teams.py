import uuid
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db, require_roles
from app.models.user import User, UserRole
from app.schemas.team import TeamCreate, TeamMemberCreate, TeamMemberResponse, TeamResponse
from app.services.team_service import TeamService

router = APIRouter()


@router.post(
    "",
    response_model=TeamResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a student team around an adopted problem",
    description="Allows verified UNIVERSITY mentors to adopt a standardized problem and create a student team.",
)
async def create_team(
    payload: TeamCreate,
    current_user: User = Depends(require_roles(UserRole.UNIVERSITY)),
    db: AsyncSession = Depends(get_db),
) -> TeamResponse:
    return await TeamService.create_team(
        db=db,
        current_user=current_user,
        payload=payload,
    )


@router.post(
    "/{team_id}/members",
    response_model=TeamMemberResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add a student member to a team",
    description="Allows the UNIVERSITY mentor who created the team to assign student members (max 8 students).",
)
async def add_team_member(
    team_id: uuid.UUID,
    payload: TeamMemberCreate,
    current_user: User = Depends(require_roles(UserRole.UNIVERSITY)),
    db: AsyncSession = Depends(get_db),
) -> TeamMemberResponse:
    return await TeamService.add_team_member(
        db=db,
        current_user=current_user,
        team_id=team_id,
        payload=payload,
    )
