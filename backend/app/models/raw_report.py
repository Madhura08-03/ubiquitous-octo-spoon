from enum import Enum as PyEnum
import uuid
from typing import Optional
from sqlalchemy import Enum, Float, ForeignKey, String, Text, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base, TimestampMixin, UUIDMixin


class RawReportStatus(str, PyEnum):
    RECEIVED = "RECEIVED"
    UNDER_REVIEW = "UNDER_REVIEW"
    PROCESSED = "PROCESSED"


class RawReport(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "raw_reports"

    reporter_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    domain: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    latitude: Mapped[Optional[float]]= mapped_column(Float, nullable=True)
    longitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    photo_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    status: Mapped[RawReportStatus] = mapped_column(
        Enum(RawReportStatus, name="raw_report_status_enum", native_enum=False),
        default=RawReportStatus.RECEIVED,
        nullable=False,
    )

    # Relationships
    reporter: Mapped["User"] = relationship("User", back_populates="raw_reports")
