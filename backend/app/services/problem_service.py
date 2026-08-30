from typing import List, Optional
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.exceptions import AppException
from app.core.geo import haversine_distance
from app.models.standardized_problem import ProblemStatus, StandardizedProblem
from app.schemas.problem import ProblemListResponse, ProblemRead


class ProblemService:
    @staticmethod
    async def list_problems(
        db: AsyncSession,
        domain: Optional[str] = None,
        latitude: Optional[float] = None,
        longitude: Optional[float] = None,
        radius_km: Optional[float] = None,
        min_priority_score: Optional[float] = None,
        status: Optional[ProblemStatus] = None,
        limit: int = 20,
        offset: int = 0,
    ) -> ProblemListResponse:
        # Validate coordinates pair
        if (latitude is not None and longitude is None) or (longitude is not None and latitude is None):
            raise AppException(code="INVALID_COORDINATES", message="Both latitude and longitude must be provided for location filtering.", status_code=422)

        # Base query
        stmt = select(StandardizedProblem)

        # Status filter
        if status is not None:
            stmt = stmt.where(StandardizedProblem.status == status)
        else:
            # Default student discovery feed: active problems only
            stmt = stmt.where(
                StandardizedProblem.status.in_([ProblemStatus.OPEN, ProblemStatus.UNDER_INVESTIGATION])
            )

        # Domain filter
        if domain is not None:
            stmt = stmt.where(StandardizedProblem.domain == domain.strip().upper())

        # Priority score filter
        if min_priority_score is not None:
            stmt = stmt.where(StandardizedProblem.priority_score >= min_priority_score)

        # Sorting: priority_score DESC, created_at DESC
        stmt = stmt.order_by(
            StandardizedProblem.priority_score.desc(),
            StandardizedProblem.created_at.desc(),
        )

        result = await db.execute(stmt)
        all_matching = result.scalars().all()

        # Location filtering (if coordinates provided)
        if latitude is not None and longitude is not None:
            effective_radius = 25.0 if radius_km is None else radius_km
            filtered_by_location: List[StandardizedProblem] = []
            for prob in all_matching:
                if prob.latitude is not None and prob.longitude is not None:
                    dist = haversine_distance(latitude, longitude, prob.latitude, prob.longitude)
                    if dist <= effective_radius:
                        filtered_by_location.append(prob)
            total = len(filtered_by_location)
            paginated_items = filtered_by_location[offset : offset + limit]
        else:
            total = len(all_matching)
            paginated_items = all_matching[offset : offset + limit]

        items_read = [ProblemRead.model_validate(p) for p in paginated_items]
        return ProblemListResponse(
            items=items_read,
            total=total,
            limit=limit,
            offset=offset,
        )
