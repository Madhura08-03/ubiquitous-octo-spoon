from enum import Enum as PyEnum
import uuid
from typing import List, Optional
from sqlalchemy import Enum, ForeignKey, String, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base, TimestampMixin, UUIDMixin


class TeamStatus(str, PyEnum):
    FORMING = "FORMING"
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"
    DISBANDED = "DISBANDED"


class Team(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "teams"

    problem_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey("standardized_problems.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    university_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey("users.id", ondelete="RESTRICT"),
        index=True,
        nullable=True,
    )
    mentor_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey("users.id", ondelete="RESTRICT"),
        index=True,
        nullable=True,
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[TeamStatus] = mapped_column(
        Enum(TeamStatus, name="team_status_enum", native_enum=False),
        default=TeamStatus.FORMING,
        nullable=False,
    )

    # Relationships
    problem: Mapped["StandardizedProblem"] = relationship("StandardizedProblem", back_populates="teams")
    university: Mapped[Optional["User"]] = relationship("User", back_populates="teams_as_university", foreign_keys=[university_id])
    mentor: Mapped[Optional["User"]] = relationship("User", back_populates="teams_as_mentor", foreign_keys=[mentor_id])
    members: Mapped[List["TeamMember"]] = relationship("TeamMember", back_populates="team", cascade="all, delete-orphan")
    solutions: Mapped[List["Solution"]] = relationship("Solution", back_populates="team")
