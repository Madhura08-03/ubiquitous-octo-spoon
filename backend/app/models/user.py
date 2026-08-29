from enum import Enum as PyEnum
from typing import List, Optional
from sqlalchemy import Boolean, Enum, String, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base, TimestampMixin, UUIDMixin


class UserRole(str, PyEnum):
    CITIZEN = "CITIZEN"
    STUDENT = "STUDENT"
    UNIVERSITY = "UNIVERSITY"
    INDUSTRY = "INDUSTRY"
    GOVERNMENT = "GOVERNMENT"


class User(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole, name="user_role_enum", native_enum=False),
        index=True,
        nullable=False,
    )
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Relationships
    raw_reports: Mapped[List["RawReport"]] = relationship(
        "RawReport",
        back_populates="reporter",
        cascade="all, delete-orphan",
    )
    points_events: Mapped[List["PointsEvent"]] = relationship(
        "PointsEvent",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    audit_logs: Mapped[List["AuditLog"]] = relationship(
        "AuditLog",
        back_populates="actor",
        foreign_keys="[AuditLog.actor_user_id]",
    )
    teams_as_university: Mapped[List["Team"]] = relationship(
        "Team",
        back_populates="university",
        foreign_keys="[Team.university_id]",
    )
    teams_as_mentor: Mapped[List["Team"]] = relationship(
        "Team",
        back_populates="mentor",
        foreign_keys="[Team.mentor_id]",
    )
    solutions_proposed: Mapped[List["Solution"]] = relationship(
        "Solution",
        back_populates="proposer",
        foreign_keys="[Solution.proposed_by]",
    )
