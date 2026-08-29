from enum import Enum as PyEnum
import uuid
from typing import Optional
from sqlalchemy import Enum, ForeignKey, String, Text, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base, TimestampMixin, UUIDMixin


class PrototypeStatus(str, PyEnum):
    IN_DEVELOPMENT = "IN_DEVELOPMENT"
    SUBMITTED = "SUBMITTED"
    GOVERNMENT_REVIEW = "GOVERNMENT_REVIEW"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


class GovernmentReviewStatus(str, PyEnum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


class Prototype(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "prototypes"

    solution_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey("solutions.id", ondelete="CASCADE"),
        unique=True,
        index=True,
        nullable=False,
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    demo_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    repository_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    status: Mapped[PrototypeStatus] = mapped_column(
        Enum(PrototypeStatus, name="prototype_status_enum", native_enum=False),
        default=PrototypeStatus.IN_DEVELOPMENT,
        nullable=False,
    )
    government_review_status: Mapped[GovernmentReviewStatus] = mapped_column(
        Enum(GovernmentReviewStatus, name="government_review_status_enum", native_enum=False),
        default=GovernmentReviewStatus.PENDING,
        nullable=False,
    )

    # Relationships
    solution: Mapped["Solution"] = relationship("Solution", back_populates="prototype")
