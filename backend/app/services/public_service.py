from typing import List, Optional
from sqlalchemy import case, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.exceptions import AppException
from app.core.geo import haversine_distance
from app.models.prototype import GovernmentReviewStatus, Prototype
from app.models.raw_report import RawReport
from app.models.solution import IndustryReviewStatus, Solution
from app.models.standardized_problem import ProblemStatus, StandardizedProblem
from app.models.team import Team
from app.schemas.public import (
    DomainAnalyticsItem,
    PublicAnalyticsResponse,
    PublicProblemListResponse,
    PublicProblemResponse,
)


class PublicService:
    @staticmethod
    async def get_public_problems(
        db: AsyncSession,
        domain: Optional[str] = None,
        latitude: Optional[float] = None,
        longitude: Optional[float] = None,
        radius_km: Optional[float] = None,
        status: Optional[ProblemStatus] = None,
        limit: int = 20,
        offset: int = 0,
    ) -> PublicProblemListResponse:
        """
        Public problems discovery feed with zero PII exposure.
        """
        if (latitude is not None and longitude is None) or (longitude is not None and latitude is None):
            raise AppException(
                code="INVALID_COORDINATES",
                message="Both latitude and longitude must be provided for location filtering.",
                status_code=422,
            )

        stmt = select(StandardizedProblem)

        # Status filter (defaults to all active and resolved public statuses)
        if status is not None:
            stmt = stmt.where(StandardizedProblem.status == status)
        else:
            stmt = stmt.where(
                StandardizedProblem.status.in_([
                    ProblemStatus.OPEN,
                    ProblemStatus.UNDER_INVESTIGATION,
                    ProblemStatus.ADOPTED,
                    ProblemStatus.IN_DEVELOPMENT,
                    ProblemStatus.PROTOTYPE,
                    ProblemStatus.RESOLVED,
                ])
            )

        if domain is not None:
            stmt = stmt.where(StandardizedProblem.domain == domain.strip().upper())

        # Sort: priority_score DESC, created_at DESC
        stmt = stmt.order_by(
            StandardizedProblem.priority_score.desc(),
            StandardizedProblem.created_at.desc(),
        )

        res = await db.execute(stmt)
        all_problems = res.scalars().all()

        # Location filter
        if latitude is not None and longitude is not None:
            effective_radius = 25.0 if radius_km is None else radius_km
            filtered: List[StandardizedProblem] = []
            for prob in all_problems:
                if prob.latitude is not None and prob.longitude is not None:
                    dist = haversine_distance(latitude, longitude, prob.latitude, prob.longitude)
                    if dist <= effective_radius:
                        filtered.append(prob)
            total = len(filtered)
            paginated = filtered[offset : offset + limit]
        else:
            total = len(all_problems)
            paginated = all_problems[offset : offset + limit]

        items = [PublicProblemResponse.model_validate(p) for p in paginated]
        return PublicProblemListResponse(
            items=items,
            total=total,
            limit=limit,
            offset=offset,
        )

    @staticmethod
    async def get_public_analytics(db: AsyncSession) -> PublicAnalyticsResponse:
        """
        Aggregate high-level public societal impact metrics from actual database records.
        No mock or fabricated numbers. Zero PII.
        """
        # 1. Total problems & status counts
        prob_stmt = select(
            func.count(StandardizedProblem.id).label("total"),
            func.count(case((StandardizedProblem.status == ProblemStatus.OPEN, 1))).label("open_cnt"),
            func.count(case((StandardizedProblem.status.in_([
                ProblemStatus.UNDER_INVESTIGATION,
                ProblemStatus.ADOPTED,
                ProblemStatus.IN_DEVELOPMENT,
                ProblemStatus.PROTOTYPE,
            ]), 1))).label("in_progress_cnt"),
            func.count(case((StandardizedProblem.status == ProblemStatus.RESOLVED, 1))).label("resolved_cnt"),
            func.coalesce(func.sum(StandardizedProblem.evidence_count), 0).label("evidence_cnt"),
        )
        prob_res = await db.execute(prob_stmt)
        prob_row = prob_res.one()

        # 2. Total raw reports
        rep_stmt = select(func.count(RawReport.id))
        rep_res = await db.execute(rep_stmt)
        total_reports = rep_res.scalar() or 0

        # 3. Total teams
        team_stmt = select(func.count(Team.id))
        team_res = await db.execute(team_stmt)
        total_teams = team_res.scalar() or 0

        # 4. Total solutions & approved solutions
        sol_stmt = select(
            func.count(Solution.id).label("total_sols"),
            func.count(case((Solution.industry_review_status == IndustryReviewStatus.APPROVED, 1))).label("approved_sols"),
        )
        sol_res = await db.execute(sol_stmt)
        sol_row = sol_res.one()

        # 5. Approved prototypes
        proto_stmt = select(func.count(Prototype.id)).where(
            Prototype.government_review_status == GovernmentReviewStatus.APPROVED
        )
        proto_res = await db.execute(proto_stmt)
        approved_prototypes = proto_res.scalar() or 0

        # 6. Domain breakdown: aggregate problem count & report count per domain
        # Subquery for problem counts
        prob_domain_stmt = (
            select(
                StandardizedProblem.domain.label("domain"),
                func.count(StandardizedProblem.id).label("problem_count"),
            )
            .group_by(StandardizedProblem.domain)
        )
        prob_domain_res = await db.execute(prob_domain_stmt)
        prob_domain_map = {row.domain: row.problem_count for row in prob_domain_res.all()}

        # Subquery for raw report counts
        rep_domain_stmt = (
            select(
                RawReport.domain.label("domain"),
                func.count(RawReport.id).label("report_count"),
            )
            .group_by(RawReport.domain)
        )
        rep_domain_res = await db.execute(rep_domain_stmt)
        rep_domain_map = {row.domain: row.report_count for row in rep_domain_res.all()}

        all_domains = sorted(set(list(prob_domain_map.keys()) + list(rep_domain_map.keys())))
        domain_items: List[DomainAnalyticsItem] = []
        for d in all_domains:
            domain_items.append(
                DomainAnalyticsItem(
                    domain=d,
                    problem_count=prob_domain_map.get(d, 0),
                    report_count=rep_domain_map.get(d, 0),
                )
            )

        # Sort domain breakdown: problem_count DESC, domain ASC
        domain_items.sort(key=lambda x: (-x.problem_count, x.domain))

        return PublicAnalyticsResponse(
            total_problems=prob_row.total or 0,
            total_reports=total_reports,
            open_problems=prob_row.open_cnt or 0,
            in_progress_problems=prob_row.in_progress_cnt or 0,
            resolved_problems=prob_row.resolved_cnt or 0,
            total_evidence_items=int(prob_row.evidence_cnt or 0),
            total_teams=total_teams,
            total_solutions=sol_row.total_sols or 0,
            industry_approved_solutions=sol_row.approved_sols or 0,
            approved_prototypes=approved_prototypes,
            domain_breakdown=domain_items,
        )
