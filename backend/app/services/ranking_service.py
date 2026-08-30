import uuid
from typing import List
from sqlalchemy import distinct, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.points_event import PointsEvent
from app.models.user import User, UserRole
from app.schemas.rankings import (
    IndustryRankingItem,
    IndustryRankingResponse,
    UniversityRankingItem,
    UniversityRankingResponse,
)


class RankingService:
    @staticmethod
    async def get_university_rankings(
        db: AsyncSession,
        limit: int = 20,
        offset: int = 0,
    ) -> UniversityRankingResponse:
        """
        Aggregate total points and count of successful milestones for all verified university accounts.
        Sorted deterministically: total_points DESC, successful_milestones DESC, full_name ASC.
        """
        # Outer join Users (role=UNIVERSITY) with PointsEvent
        stmt = (
            select(
                User.id.label("university_id"),
                User.full_name.label("name"),
                func.coalesce(func.sum(PointsEvent.points), 0).label("points"),
                func.count(PointsEvent.id).label("successful_milestones"),
            )
            .outerjoin(PointsEvent, PointsEvent.user_id == User.id)
            .where(User.role == UserRole.UNIVERSITY, User.is_active == True)
            .group_by(User.id, User.full_name)
            .order_by(
                func.coalesce(func.sum(PointsEvent.points), 0).desc(),
                func.count(PointsEvent.id).desc(),
                User.full_name.asc(),
            )
        )

        res = await db.execute(stmt)
        rows = res.all()
        total = len(rows)

        paginated_rows = rows[offset : offset + limit]
        items: List[UniversityRankingItem] = []
        for idx, r in enumerate(paginated_rows):
            items.append(
                UniversityRankingItem(
                    rank=offset + idx + 1,
                    university_id=r.university_id,
                    name=r.name,
                    points=int(r.points),
                    successful_milestones=int(r.successful_milestones),
                )
            )

        return UniversityRankingResponse(
            items=items,
            total=total,
            limit=limit,
            offset=offset,
        )

    @staticmethod
    async def get_industry_rankings(
        db: AsyncSession,
        limit: int = 20,
        offset: int = 0,
    ) -> IndustryRankingResponse:
        """
        Aggregate total points and count of contributions for verified industry accounts.
        Sorted deterministically: total_points DESC, successful_contributions DESC, full_name ASC.
        """
        stmt = (
            select(
                User.id.label("industry_id"),
                User.full_name.label("name"),
                func.coalesce(func.sum(PointsEvent.points), 0).label("points"),
                func.count(PointsEvent.id).label("successful_contributions"),
            )
            .outerjoin(PointsEvent, PointsEvent.user_id == User.id)
            .where(User.role == UserRole.INDUSTRY, User.is_active == True)
            .group_by(User.id, User.full_name)
            .order_by(
                func.coalesce(func.sum(PointsEvent.points), 0).desc(),
                func.count(PointsEvent.id).desc(),
                User.full_name.asc(),
            )
        )

        res = await db.execute(stmt)
        rows = res.all()
        total = len(rows)

        paginated_rows = rows[offset : offset + limit]
        items: List[IndustryRankingItem] = []
        for idx, r in enumerate(paginated_rows):
            items.append(
                IndustryRankingItem(
                    rank=offset + idx + 1,
                    industry_id=r.industry_id,
                    name=r.name,
                    points=int(r.points),
                    successful_contributions=int(r.successful_contributions),
                )
            )

        return IndustryRankingResponse(
            items=items,
            total=total,
            limit=limit,
            offset=offset,
        )
