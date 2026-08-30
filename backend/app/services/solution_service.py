import json
import logging
import uuid
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.exceptions import AppException, ForbiddenException, NotFoundException
from app.core.points_config import POINT_CONFIG, PointReason
from app.models.audit_log import AuditLog
from app.models.solution import IndustryReviewStatus, Solution, SolutionStatus
from app.models.team import Team, TeamStatus
from app.models.team_member import TeamMember
from app.models.user import User
from app.schemas.solution import (
    IndustryReviewCreate,
    IndustryReviewDecision,
    IndustryReviewResponse,
    SolutionCreate,
    SolutionResponse,
)
from app.services.points_service import PointsService

logger = logging.getLogger("samanvay.solution_service")


class SolutionService:
    @staticmethod
    async def create_solution(
        db: AsyncSession,
        current_user: User,
        payload: SolutionCreate,
    ) -> SolutionResponse:
        """Allows verified UNIVERSITY mentor to propose a solution for their adopted team/problem."""
        if not current_user.is_verified or not current_user.is_active:
            raise ForbiddenException("Only verified active university mentor accounts can propose solutions.")

        stmt = select(Team).where(Team.id == payload.team_id)
        res = await db.execute(stmt)
        team = res.scalars().first()
        if not team:
            raise NotFoundException(f"Team with id '{payload.team_id}' not found.")

        if team.mentor_id != current_user.id and team.university_id != current_user.id:
            raise AppException(
                code="TEAM_ACCESS_DENIED",
                message="Only the university mentor who owns this team can propose a solution.",
                status_code=403,
            )

        solution = Solution(
            id=uuid.uuid4(),
            problem_id=team.problem_id,
            team_id=team.id,
            proposed_by=current_user.id,
            title=payload.title,
            description=payload.description,
            status=SolutionStatus.SUBMITTED,
            industry_review_status=IndustryReviewStatus.PENDING,
        )
        db.add(solution)

        audit = AuditLog(
            actor_user_id=current_user.id,
            action="SOLUTION_PROPOSED",
            entity_type="SOLUTION",
            entity_id=solution.id,
            metadata_json=json.dumps({
                "team_id": str(team.id),
                "problem_id": str(team.problem_id),
                "title": solution.title,
                "proposed_by": str(current_user.id),
            }),
        )
        db.add(audit)

        try:
            await db.commit()
            await db.refresh(solution)
        except Exception as exc:
            await db.rollback()
            logger.error(f"Failed to create solution: {exc}", exc_info=True)
            raise

        logger.info(f"Solution {solution.id} proposed by mentor {current_user.email} for Team {team.id}")

        return SolutionResponse(
            solution_id=solution.id,
            problem_id=solution.problem_id,
            team_id=solution.team_id,
            proposed_by=solution.proposed_by,
            title=solution.title,
            description=solution.description,
            status=solution.status,
            industry_review_status=solution.industry_review_status,
            created_at=solution.created_at,
        )

    @staticmethod
    async def review_solution(
        db: AsyncSession,
        current_user: User,
        solution_id: uuid.UUID,
        payload: IndustryReviewCreate,
    ) -> IndustryReviewResponse:
        if not current_user.is_verified or not current_user.is_active:
            raise ForbiddenException("Only verified industry accounts can review solutions.")

        stmt = select(Solution).where(Solution.id == solution_id)
        res = await db.execute(stmt)
        solution = res.scalars().first()
        if not solution:
            raise NotFoundException(f"Solution with id '{solution_id}' not found.")

        if solution.status not in (SolutionStatus.SUBMITTED, SolutionStatus.INDUSTRY_REVIEW):
            raise AppException(
                code="SOLUTION_NOT_REVIEWABLE",
                message=f"Solution in status '{solution.status.value}' cannot be reviewed by industry.",
                status_code=400,
            )

        if payload.decision in (IndustryReviewDecision.NEEDS_CHANGES, IndustryReviewDecision.REJECT):
            if not payload.review_comment or not payload.review_comment.strip():
                raise AppException(
                    code="COMMENT_REQUIRED",
                    message="Please provide a reason for this decision.",
                    status_code=422,
                )

        if payload.decision == IndustryReviewDecision.APPROVE:
            solution.status = SolutionStatus.APPROVED
            solution.industry_review_status = IndustryReviewStatus.APPROVED
            action_name = "INDUSTRY_SOLUTION_APPROVED"

            # Fetch team and team members to award milestone points
            team_stmt = select(Team).where(Team.id == solution.team_id)
            team_res = await db.execute(team_stmt)
            team = team_res.scalars().first()
            if team:
                members_stmt = select(TeamMember.student_id).where(TeamMember.team_id == team.id)
                members_res = await db.execute(members_stmt)
                student_ids = members_res.scalars().all()

                # Award university & student team points
                if team.mentor_id:
                    await PointsService.award_team_industry_approval_points(
                        db=db,
                        mentor_id=team.mentor_id,
                        student_ids=student_ids,
                        solution_id=solution.id,
                    )

        elif payload.decision == IndustryReviewDecision.NEEDS_CHANGES:
            solution.status = SolutionStatus.INDUSTRY_REVIEW
            solution.industry_review_status = IndustryReviewStatus.PENDING
            action_name = "INDUSTRY_SOLUTION_NEEDS_CHANGES"
        elif payload.decision == IndustryReviewDecision.REJECT:
            solution.status = SolutionStatus.REJECTED
            solution.industry_review_status = IndustryReviewStatus.REJECTED
            action_name = "INDUSTRY_SOLUTION_REJECTED"

        # Award INDUSTRY_REVIEW_COMPLETED points to reviewer (50 pts)
        ind_pts = POINT_CONFIG[PointReason.INDUSTRY_REVIEW_COMPLETED]["industry_points"]
        await PointsService.award_milestone_points(
            db=db,
            user_id=current_user.id,
            points=ind_pts,
            reason=PointReason.INDUSTRY_REVIEW_COMPLETED,
            entity_type="SOLUTION",
            entity_id=solution.id,
        )

        audit = AuditLog(
            actor_user_id=current_user.id,
            action=action_name,
            entity_type="SOLUTION",
            entity_id=solution.id,
            metadata_json=json.dumps({
                "decision": payload.decision.value,
                "review_comment": payload.review_comment,
                "reviewer_id": str(current_user.id),
            }),
        )
        db.add(audit)

        try:
            await db.commit()
            await db.refresh(solution)
        except Exception as exc:
            await db.rollback()
            logger.error(f"Failed to commit industry review: {exc}", exc_info=True)
            raise

        logger.info(f"Solution {solution.id} reviewed with decision '{payload.decision.value}' by {current_user.email}")

        return IndustryReviewResponse(
            solution_id=solution.id,
            status=solution.status,
            industry_review_status=solution.industry_review_status,
            decision=payload.decision,
        )
