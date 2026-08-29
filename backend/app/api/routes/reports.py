from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db, require_roles
from app.models.user import User, UserRole
from app.schemas.report import ReportCreate, ReportResponse
from app.services.report_service import ReportService

router = APIRouter()


@router.post(
    "",
    response_model=ReportResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit a citizen civic report",
    description="Allows authenticated CITIZEN users to submit a societal or civic problem report.",
)
async def create_citizen_report(
    payload: ReportCreate,
    current_user: User = Depends(require_roles(UserRole.CITIZEN)),
    db: AsyncSession = Depends(get_db),
) -> ReportResponse:
    return await ReportService.create_report(
        db=db,
        reporter=current_user,
        payload=payload,
    )
