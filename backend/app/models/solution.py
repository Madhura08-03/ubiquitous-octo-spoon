from enum import Enum as PyEnum
import uuid
from typing import Optional
from sqlalchemy import Enum, ForeignKey, String, Text, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base, TimestampMixin, UUIDMixin


class SolutionStatus(str, PyEnum):
    DRAFT = "DRAFT"
    SUBMITTED = "SUBMITTED"
    INDUSTRY_REVIEW = "INDUSTRY_REVIEW"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


class IndustryReviewStatus(str, PyEnum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


class Solution(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "solutions"

    problem_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey("standardized_problems.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    team_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey("teams.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    proposed_by: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey("users.id", ondelete="RESTRICT"),
        index=True,
        nullable=False,
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[SolutionStatus] = mapped_column(
        Enum(SolutionStatus, name="solution_status_enum", native_enum=False),
        default=SolutionStatus.DRAFT,
        nullable=False,
    )
    industry_review_status: Mapped[IndustryReviewStatus] = mapped_column(
        Enum(IndustryReviewStatus, name="industry_review_status_enum", native_enum=False),
        default=IndustryReviewStatus.PENDING,
        nullable=False,
    )

    # Relationships
    problem: Mapped["StandardizedProblem"] = relationship("StandardizedProblem", back_populates="solutions")
    team: Mapped["Team"] = relationship("Team", back_populates="solutions")
    proposer: Mapped["User"] = relationship("User", back_populates="solutions_proposed", foreign_keys=[proposed_by])
    prototype: Mapped[Optional["Prototype"]] = relationship("Prototype", back_populates="solution", uselist=False)
