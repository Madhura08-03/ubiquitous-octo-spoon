import json
import logging
import uuid
from typing import Dict, List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.points_config import (
    POINT_CONFIG,
    PointReason,
    ProblemComplexity,
    calculate_final_verified_points,
)
from app.models.audit_log import AuditLog
from app.models.points_event import PointsEvent

logger = logging.getLogger("samanvay.points_service")


def distribute_points_to_students(total_points: int, student_ids: List[uuid.UUID]) -> Dict[uuid.UUID, int]:
    """
    Deterministically divide a configured point allocation equally among eligible team members.
    If division produces a remainder, remainder points are distributed deterministically
    by sorted student UUID string order.
    """
    if not student_ids:
        return {}
    n = len(student_ids)
    base = total_points // n
    remainder = total_points % n

    sorted_ids = sorted(student_ids, key=lambda x: str(x))
    distribution: Dict[uuid.UUID, int] = {}
    for idx, sid in enumerate(sorted_ids):
        distribution[sid] = base + (1 if idx < remainder else 0)
    return distribution


class PointsService:
    @staticmethod
    async def award_milestone_points(
        db: AsyncSession,
        user_id: uuid.UUID,
        points: int,
        reason: PointReason,
        entity_type: str,
        entity_id: uuid.UUID,
    ) -> Optional[PointsEvent]:
        """
        Idempotently award points for a verified milestone and record an AuditLog entry.
        Returns created PointsEvent or None if milestone was already awarded.
        """
        stmt = select(PointsEvent).where(
            PointsEvent.user_id == user_id,
            PointsEvent.entity_type == entity_type,
            PointsEvent.entity_id == entity_id,
            PointsEvent.reason == reason.value,
        )
        res = await db.execute(stmt)
        if res.scalars().first():
            logger.info(f"Points already awarded for {reason.value} on {entity_type}:{entity_id} to {user_id}")
            return None

        event_id = uuid.uuid4()
        event = PointsEvent(
            id=event_id,
            user_id=user_id,
            points=points,
            reason=reason.value,
            entity_type=entity_type,
            entity_id=entity_id,
        )
        db.add(event)

        audit = AuditLog(
            actor_user_id=user_id,
            action="POINTS_AWARDED",
            entity_type="POINTS_EVENT",
            entity_id=event_id,
            metadata_json=json.dumps({
                "points": points,
                "reason": reason.value,
                "source_entity_type": entity_type,
                "source_entity_id": str(entity_id),
            }),
        )
        db.add(audit)

        logger.info(f"Awarded {points} pts to user {user_id} for {reason.value}")
        return event

    @staticmethod
    async def award_team_industry_approval_points(
        db: AsyncSession,
        mentor_id: uuid.UUID,
        student_ids: List[uuid.UUID],
        solution_id: uuid.UUID,
    ) -> List[PointsEvent]:
        """
        Award engagement points for INDUSTRY_APPROVED milestone:
        - University mentor receives configured university points (100 pts)
        - Student team members deterministically share configured student points (100 pts)
        """
        config = POINT_CONFIG[PointReason.INDUSTRY_APPROVED]
        events: List[PointsEvent] = []

        # 1. Award mentor points
        mentor_pts = config.get("university_points", 100)
        ev_mentor = await PointsService.award_milestone_points(
            db=db,
            user_id=mentor_id,
            points=mentor_pts,
            reason=PointReason.INDUSTRY_APPROVED,
            entity_type="SOLUTION",
            entity_id=solution_id,
        )
        if ev_mentor:
            events.append(ev_mentor)

        # 2. Award student points
        team_total = config.get("student_team_total_points", 100)
        distribution = distribute_points_to_students(team_total, student_ids)
        for sid, pts in distribution.items():
            ev_stu = await PointsService.award_milestone_points(
                db=db,
                user_id=sid,
                points=pts,
                reason=PointReason.INDUSTRY_APPROVED,
                entity_type="SOLUTION",
                entity_id=solution_id,
            )
            if ev_stu:
                events.append(ev_stu)

        return events

    @staticmethod
    async def award_final_verified_reward(
        db: AsyncSession,
        user_id: uuid.UUID,
        solution_id: uuid.UUID,
        complexity: ProblemComplexity,
        novelty_score: float,
        quality_score: float,
        is_novelty_manually_approved: bool = False,
    ) -> Optional[PointsEvent]:
        """
        Hook for future final solution verification reward.
        Calculates final points via pure arithmetic formula and records FINAL_SOLUTION_VERIFIED event.
        (Reserved for future implementation; not triggered during current MVP flow).
        """
        final_pts = calculate_final_verified_points(
            complexity=complexity,
            novelty_score=novelty_score,
            quality_score=quality_score,
            is_novelty_manually_approved=is_novelty_manually_approved,
        )
        if final_pts <= 0:
            return None

        return await PointsService.award_milestone_points(
            db=db,
            user_id=user_id,
            points=final_pts,
            reason=PointReason.FINAL_SOLUTION_VERIFIED,
            entity_type="SOLUTION",
            entity_id=solution_id,
        )
