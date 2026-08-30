import pytest
from app.models import (
    User,
    UserRole,
    RawReport,
    RawReportStatus,
    StandardizedProblem,
    ProblemStatus,
    Team,
    TeamStatus,
    TeamMember,
    Solution,
    SolutionStatus,
    IndustryReviewStatus,
    Prototype,
    PrototypeStatus,
    GovernmentReviewStatus,
    PointsEvent,
    AuditLog,
)
from app.core.security import hash_password


@pytest.mark.asyncio
async def test_all_9_models_creation(db_session):
    # 1. User
    user = User(
        email="modeltest@test.local",
        full_name="Model Test User",
        password_hash=hash_password("Secret123!"),
        role=UserRole.CITIZEN,
        is_verified=True,
    )
    db_session.add(user)
    await db_session.flush()
    assert user.id is not None

    # Student user for team member testing
    student_user = User(
        email="modelstudent@test.local",
        full_name="Model Student",
        password_hash=hash_password("Secret123!"),
        role=UserRole.STUDENT,
        is_verified=True,
    )
    db_session.add(student_user)
    await db_session.flush()

    # 2. RawReport
    report = RawReport(
        reporter_id=user.id,
        title="Broken Streetlight",
        description="Dangerous dark corner",
        domain="Electricity & Infrastructure",
        latitude=23.34,
        longitude=85.30,
        status=RawReportStatus.RECEIVED,
    )
    db_session.add(report)
    await db_session.flush()
    assert report.id is not None

    # 3. StandardizedProblem
    problem = StandardizedProblem(
        title="Street Lighting Safety Hazard",
        domain="Electricity & Infrastructure",
        problem_summary="Multiple dark areas reported",
        affected_community="Sector 4 Residents",
        observed_impact="High risk of accidents at night",
        latitude=23.34,
        longitude=85.30,
        status=ProblemStatus.OPEN,
        report_count=1,
        priority_score=75.0,
    )
    db_session.add(problem)
    await db_session.flush()
    assert problem.id is not None

    # 4. Team
    team = Team(
        problem_id=problem.id,
        name="Bright Sparks Team",
        university_id=user.id,
        mentor_id=user.id,
        status=TeamStatus.ACTIVE,
    )
    db_session.add(team)
    await db_session.flush()
    assert team.id is not None

    # 5. TeamMember (9th Model)
    member = TeamMember(
        team_id=team.id,
        student_id=student_user.id,
        role_in_team="Hardware Lead",
    )
    db_session.add(member)
    await db_session.flush()
    assert member.id is not None
    assert member.team_id == team.id
    assert member.student_id == student_user.id

    # 6. Solution
    solution = Solution(
        problem_id=problem.id,
        team_id=team.id,
        proposed_by=student_user.id,
        title="Solar Powered Auto-lighting",
        description="Smart IoT sensors with solar panels",
        status=SolutionStatus.SUBMITTED,
        industry_review_status=IndustryReviewStatus.PENDING,
    )
    db_session.add(solution)
    await db_session.flush()
    assert solution.id is not None

    # 7. Prototype
    prototype = Prototype(
        solution_id=solution.id,
        title="Prototype v1 PCB",
        description="Working hardware module",
        demo_url="https://demo.example.com",
        repository_url="https://github.com/example/repo",
        status=PrototypeStatus.SUBMITTED,
        government_review_status=GovernmentReviewStatus.PENDING,
    )
    db_session.add(prototype)
    await db_session.flush()
    assert prototype.id is not None

    # 8. PointsEvent
    points = PointsEvent(
        user_id=user.id,
        points=15,
        reason="Report verified",
        entity_type="RAW_REPORT",
        entity_id=report.id,
    )
    db_session.add(points)
    await db_session.flush()
    assert points.id is not None

    # 9. AuditLog
    audit = AuditLog(
        actor_user_id=user.id,
        action="REPORT_CREATED",
        entity_type="RAW_REPORT",
        entity_id=report.id,
        metadata_json='{"source": "mobile"}',
    )
    db_session.add(audit)
    await db_session.commit()
    assert audit.id is not None
