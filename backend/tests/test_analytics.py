import pytest
import uuid
from sqlalchemy import select
from app.models.domain import ProblemDomain
from app.models.prototype import GovernmentReviewStatus, Prototype, PrototypeStatus
from app.models.raw_report import RawReport, RawReportStatus
from app.models.solution import IndustryReviewStatus, Solution, SolutionStatus
from app.models.standardized_problem import ProblemStatus, StandardizedProblem
from app.models.team import Team, TeamStatus
from app.models.user import User, UserRole


@pytest.mark.asyncio
async def test_public_analytics_empty_database_returns_zero_safe_values(client):
    resp = await client.get("/public/analytics")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_problems"] >= 0
    assert data["total_reports"] >= 0
    assert data["open_problems"] >= 0
    assert data["in_progress_problems"] >= 0
    assert data["resolved_problems"] >= 0
    assert data["total_evidence_items"] >= 0
    assert data["total_teams"] >= 0
    assert data["total_solutions"] >= 0
    assert data["industry_approved_solutions"] >= 0
    assert data["approved_prototypes"] >= 0
    assert isinstance(data["domain_breakdown"], list)


@pytest.mark.asyncio
async def test_public_analytics_real_database_aggregation(client, db_session, seed_users):
    # 1. Create a user
    stmt_cit = select(User).where(User.email == "citizen@test.local")
    citizen = (await db_session.execute(stmt_cit)).scalars().first()

    stmt_uni = select(User).where(User.email == "university@test.local")
    uni_user = (await db_session.execute(stmt_uni)).scalars().first()

    # 2. Add raw report
    rep = RawReport(
        id=uuid.uuid4(),
        reporter_id=citizen.id,
        title="Analytics Test Raw Report",
        description="Description for analytics aggregation test exceeding twenty chars.",
        domain=ProblemDomain.WATER_MANAGEMENT.value,
        latitude=23.34,
        longitude=85.30,
        status=RawReportStatus.RECEIVED,
    )
    db_session.add(rep)

    # 3. Add standardized problem
    prob = StandardizedProblem(
        id=uuid.uuid4(),
        title="Analytics Standardized Problem",
        domain=ProblemDomain.WATER_MANAGEMENT.value,
        problem_summary="Summary for analytics test",
        evidence_count=5,
        priority_score=90.0,
        status=ProblemStatus.OPEN,
    )
    db_session.add(prob)

    # 4. Add team & solution
    team = Team(
        id=uuid.uuid4(),
        problem_id=prob.id,
        university_id=uni_user.id,
        mentor_id=uni_user.id,
        name="Analytics Test Team",
        status=TeamStatus.ACTIVE,
    )
    db_session.add(team)

    sol = Solution(
        id=uuid.uuid4(),
        problem_id=prob.id,
        team_id=team.id,
        proposed_by=citizen.id,
        title="Analytics Solution",
        description="Solution description",
        status=SolutionStatus.APPROVED,
        industry_review_status=IndustryReviewStatus.APPROVED,
    )
    db_session.add(sol)

    await db_session.commit()

    resp = await client.get("/public/analytics")
    assert resp.status_code == 200
    data = resp.json()

    assert data["total_problems"] >= 1
    assert data["total_reports"] >= 1
    assert data["open_problems"] >= 1
    assert data["total_teams"] >= 1
    assert data["total_solutions"] >= 1
    assert data["industry_approved_solutions"] >= 1

    # Verify domain breakdown has WATER_MANAGEMENT
    water_item = next((item for item in data["domain_breakdown"] if item["domain"] == "WATER_MANAGEMENT"), None)
    assert water_item is not None
    assert water_item["problem_count"] >= 1
