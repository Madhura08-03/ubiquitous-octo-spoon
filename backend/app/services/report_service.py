import logging
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.raw_report import RawReport, RawReportStatus
from app.models.user import User
from app.schemas.report import ReportCreate, ReportResponse
from app.services.ai_service import AIService

logger = logging.getLogger("samanvay.report_service")


class ReportService:
    @staticmethod
    def _generate_fallback_title(description: str) -> str:
        """Derive a simple non-AI fallback title from the first sentence or first 80 characters."""
        first_line = description.strip().split("\n")[0].strip()
        first_sentence = first_line.split(".")[0].strip()
        if len(first_sentence) >= 5:
            return first_sentence[:80]
        return description[:80].strip()

    @staticmethod
    async def create_report(
        db: AsyncSession,
        reporter: User,
        payload: ReportCreate,
    ) -> ReportResponse:
        # Determine title
        title = payload.title or ReportService._generate_fallback_title(payload.description)

        # 1. Create RawReport entity with status RECEIVED
        report = RawReport(
            id=uuid.uuid4(),
            reporter_id=reporter.id,
            title=title,
            description=payload.description,
            domain=payload.domain.value if hasattr(payload.domain, "value") else str(payload.domain),
            latitude=payload.latitude,
            longitude=payload.longitude,
            photo_url=payload.photo_url,
            status=RawReportStatus.RECEIVED,
        )

        # 2. Persist & commit RawReport BEFORE calling AI contract
        db.add(report)
        await db.commit()
        await db.refresh(report)

        logger.info(f"Raw report saved successfully: id={report.id}, reporter={reporter.email}")

        # 3. Call AI Service Contract Stub safely
        processing_status = "STUB"
        try:
            ai_result = await AIService.process_report(
                report_id=report.id,
                description=report.description,
                domain=report.domain,
                latitude=report.latitude,
                longitude=report.longitude,
            )
            processing_status = ai_result.get("processing_status", "STUB")
        except Exception as exc:
            # Transaction safety: AI failure must NEVER delete or roll back the saved RawReport
            logger.error(f"AI processing contract failed for report {report.id}: {exc}", exc_info=True)
            processing_status = "FAILED"

        return ReportResponse(
            report_id=report.id,
            status=report.status,
            processing_status=processing_status,
            message="Your problem report has been received.",
        )
