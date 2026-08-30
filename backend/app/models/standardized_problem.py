from enum import Enum as PyEnum
from typing import List, Optional
from sqlalchemy import Enum, Float, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base, TimestampMixin, UUIDMixin


class ProblemStatus(str, PyEnum):
    OPEN = "OPEN"
    UNDER_INVESTIGATION = "UNDER_INVESTIGATION"
    ADOPTED = "ADOPTED"
    IN_DEVELOPMENT = "IN_DEVELOPMENT"
    PROTOTYPE = "PROTOTYPE"
    GOVERNMENT_REVIEW = "GOVERNMENT_REVIEW"
    RESOLVED = "RESOLVED"


class StandardizedProblem(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "standardized_problems"

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    domain: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    problem_summary: Mapped[str] = mapped_column(Text, nullable=False)
    affected_community: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    observed_impact: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    latitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    longitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    report_count: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    evidence_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    priority_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    status: Mapped[ProblemStatus] = mapped_column(
        Enum(ProblemStatus, name="problem_status_enum", native_enum=False),
        default=ProblemStatus.OPEN,
        index=True,
        nullable=False,
    )

    # Relationships
    teams: Mapped[List["Team"]] = relationship("Team", back_populates="problem")
    solutions: Mapped[List["Solution"]] = relationship("Solution", back_populates="problem")
