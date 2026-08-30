import json
import logging
import uuid
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import MAX_TEAM_STUDENTS
from app.core.exceptions import AppException, ForbiddenException, NotFoundException
from app.core.points_config import POINT_CONFIG, PointReason
from app.models.audit_log import AuditLog
from app.models.standardized_problem import ProblemStatus, StandardizedProblem
from app.models.team import Team, TeamStatus
from app.models.team_member import TeamMember
from app.models.user import User, UserRole
from app.schemas.team import TeamCreate, TeamMemberCreate, TeamMemberResponse, TeamResponse
from app.services.points_service import PointsService

logger = logging.getLogger("samanvay.team_service")


def validate_student_eligibility_for_team(student_user: User, team: Team) -> None:
    """
    Validate that a student user is eligible to join the given team.
    
    TODO (Future Milestone):
    Cross-university membership validation will be strictly enforced here
    once Student -> University institutional association is added to the User model.
    For the current MVP, role and active account status are safely enforced.
    """
    if student_user.role != UserRole.STUDENT:
        raise AppException(
            code="NOT_A_STUDENT",
            message="The selected user is not a student.",
            status_code=422,
        )

    if not student_user.is_active:
        raise AppException(
            code="STUDENT_INACTIVE",
            message="The selected student account is inactive.",
            status_code=422,
        )


class TeamService:
    @staticmethod
    async def create_team(
        db: AsyncSession,
        current_user: User,
        payload: TeamCreate,
    ) -> TeamResponse:
        if not current_user.is_verified or not current_user.is_active:
            raise ForbiddenException("Only verified university accounts can create teams.")

        stmt = select(StandardizedProblem).where(StandardizedProblem.id == payload.problem_id)
        result = await db.execute(stmt)
        problem = result.scalars().first()
        if not problem:
            raise NotFoundException(f"Standardized problem with id '{payload.problem_id}' not found.")

        # 1. Check for existing active team on this problem (returns 409)
        team_stmt = select(Team).where(
            Team.problem_id == problem.id,
            Team.status.in_([TeamStatus.FORMING, TeamStatus.ACTIVE]),
        )
        team_res = await db.execute(team_stmt)
        if team_res.scalars().first():
            raise AppException(
                code="ACTIVE_TEAM_EXISTS",
                message="This problem already has an active team.",
                status_code=409,
            )

        # 2. Check problem eligibility (only OPEN or UNDER_INVESTIGATION)
        if problem.status not in (ProblemStatus.OPEN, ProblemStatus.UNDER_INVESTIGATION):
            raise AppException(
                code="INELIGIBLE_PROBLEM_STATUS",
                message=f"Problem is in '{problem.status.value}' status and cannot be adopted for a new team.",
                status_code=400,
            )

        team_id = uuid.uuid4()
        team = Team(
            id=team_id,
            problem_id=problem.id,
            university_id=current_user.id,
            mentor_id=current_user.id,
            name=payload.name,
            status=TeamStatus.FORMING,
        )
        db.add(team)

        # Update problem status to ADOPTED
        problem.status = ProblemStatus.ADOPTED

        # Award TEAM_FORMED points to university mentor
        pts = POINT_CONFIG[PointReason.TEAM_FORMED]["university_points"]
        await PointsService.award_milestone_points(
            db=db,
            user_id=current_user.id,
            points=pts,
            reason=PointReason.TEAM_FORMED,
            entity_type="TEAM",
            entity_id=team_id,
        )

        # Create AuditLog
        audit = AuditLog(
            actor_user_id=current_user.id,
            action="TEAM_CREATED",
            entity_type="TEAM",
            entity_id=team_id,
            metadata_json=json.dumps({
                "problem_id": str(problem.id),
                "team_name": payload.name,
                "university_id": str(current_user.id),
                "mentor_id": str(current_user.id),
            }),
        )
        db.add(audit)

        try:
            await db.commit()
            await db.refresh(team)
        except Exception as exc:
            await db.rollback()
            logger.error(f"Failed to commit team creation: {exc}", exc_info=True)
            raise

        logger.info(f"Team '{team.name}' created by university {current_user.email} on problem {problem.id}")

        return TeamResponse(
            team_id=team.id,
            problem_id=team.problem_id,
            university_id=team.university_id,
            mentor_id=team.mentor_id,
            name=team.name,
            status=team.status,
            created_at=team.created_at,
        )

    @staticmethod
    async def add_team_member(
        db: AsyncSession,
        current_user: User,
        team_id: uuid.UUID,
        payload: TeamMemberCreate,
    ) -> TeamMemberResponse:
        stmt = select(Team).where(Team.id == team_id)
        res = await db.execute(stmt)
        team = res.scalars().first()
        if not team:
            raise NotFoundException(f"Team with id '{team_id}' not found.")

        # Strict Ownership check
        if team.mentor_id != current_user.id and team.university_id != current_user.id:
            raise AppException(
                code="TEAM_ACCESS_DENIED",
                message="Only the team mentor can manage this team.",
                status_code=403,
            )

        if team.status in (TeamStatus.COMPLETED, TeamStatus.DISBANDED):
            raise AppException(
                code="TEAM_CLOSED",
                message=f"Cannot add members to a team in '{team.status.value}' status.",
                status_code=400,
            )

        user_stmt = select(User).where(User.id == payload.student_id)
        user_res = await db.execute(user_stmt)
        student_user = user_res.scalars().first()
        if not student_user:
            raise NotFoundException(f"User with id '{payload.student_id}' not found.")

        validate_student_eligibility_for_team(student_user, team)

        mem_stmt = select(TeamMember).where(
            TeamMember.team_id == team.id,
            TeamMember.student_id == student_user.id,
        )
        mem_res = await db.execute(mem_stmt)
        if mem_res.scalars().first():
            raise AppException(
                code="ALREADY_TEAM_MEMBER",
                message="This student is already a member of the team.",
                status_code=409,
            )

        count_stmt = select(func.count(TeamMember.id)).where(TeamMember.team_id == team.id)
        count_res = await db.execute(count_stmt)
        current_count = count_res.scalar() or 0
        if current_count >= MAX_TEAM_STUDENTS:
            raise AppException(
                code="TEAM_FULL",
                message=f"This team has reached the maximum number of students ({MAX_TEAM_STUDENTS}).",
                status_code=409,
            )

        member_id = uuid.uuid4()
        member = TeamMember(
            id=member_id,
            team_id=team.id,
            student_id=student_user.id,
            role_in_team=payload.role_in_team or "Member",
        )
        db.add(member)

        if team.status == TeamStatus.FORMING:
            team.status = TeamStatus.ACTIVE

        # Award STUDENT_TEAM_JOINED points to student
        pts = POINT_CONFIG[PointReason.STUDENT_TEAM_JOINED]["student_points"]
        await PointsService.award_milestone_points(
            db=db,
            user_id=student_user.id,
            points=pts,
            reason=PointReason.STUDENT_TEAM_JOINED,
            entity_type="TEAM",
            entity_id=team.id,
        )

        audit = AuditLog(
            actor_user_id=current_user.id,
            action="TEAM_MEMBER_ADDED",
            entity_type="TEAM",
            entity_id=team.id,
            metadata_json=json.dumps({
                "team_id": str(team.id),
                "student_id": str(student_user.id),
                "role_in_team": member.role_in_team,
            }),
        )
        db.add(audit)

        try:
            await db.commit()
            await db.refresh(member)
            await db.refresh(team)
        except IntegrityError:
            await db.rollback()
            raise AppException(
                code="ALREADY_TEAM_MEMBER",
                message="This student is already a member of the team.",
                status_code=409,
            )
        except Exception as exc:
            await db.rollback()
            logger.error(f"Failed to commit team member addition: {exc}", exc_info=True)
            raise

        logger.info(f"Student {student_user.email} added to team {team.name} (id: {team.id})")

        return TeamMemberResponse(
            team_member_id=member.id,
            team_id=member.team_id,
            student_id=member.student_id,
            role_in_team=member.role_in_team,
            team_status=team.status,
            joined_at=member.joined_at,
        )
