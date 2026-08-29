import pytest
import uuid
from sqlalchemy import select
from app.core.points_config import (
    POINT_CONFIG,
    PointReason,
    ProblemComplexity,
    calculate_final_verified_points,
    calculate_implementation_quality_factor,
    calculate_novelty_multiplier,
)
from app.core.security import hash_password
from app.models.domain import ProblemDomain
from app.models.points_event import PointsEvent
from app.models.solution import IndustryReviewStatus, Solution, SolutionStatus
from app.models.standardized_problem import ProblemStatus, StandardizedProblem
from app.models.team import Team, TeamStatus
from app.models.user import User, UserRole
from app.services.points_service import PointsService, distribute_points_to_students


def test_final_verified_points_formula():
    # 1. High Complexity (500), 85% novelty (1.0x), 90% quality (1.2x) -> 500 * 1.0 * 1.2 = 600
    pts = calculate_final_verified_points(ProblemComplexity.HIGH, 85.0, 90.0)
    assert pts == 600

    # 2. Medium Complexity (250), 50% novelty with manual approval (0.8x), 70% quality (1.0x) -> 250 * 0.8 * 1.0 = 200
    pts2 = calculate_final_verified_points(ProblemComplexity.MEDIUM, 50.0, 70.0, is_novelty_manually_approved=True)
    assert pts2 == 200

    # 3. Medium Complexity (250), 50% novelty WITHOUT manual approval (0.0x) -> 0
    pts3 = calculate_final_verified_points(ProblemComplexity.MEDIUM, 50.0, 70.0, is_novelty_manually_approved=False)
    assert pts3 == 0

    # 4. Low Complexity (100), 80% novelty (1.0x), 50% quality (<60% -> 0.0x) -> 0
    pts4 = calculate_final_verified_points(ProblemComplexity.LOW, 80.0, 50.0)
    assert pts4 == 0


def test_distribute_points_to_students_deterministic():
    # 100 points, 3 students -> base 33, remainder 1 -> first student gets 34, other two get 33
    id1 = uuid.UUID("11111111-1111-1111-1111-111111111111")
    id2 = uuid.UUID("22222222-2222-2222-2222-222222222222")
    id3 = uuid.UUID("33333333-3333-3333-3333-333333333333")

    dist = distribute_points_to_students(100, [id3, id1, id2])  # Pass unordered
    assert dist[id1] == 34
    assert dist[id2] == 33
    assert dist[id3] == 33
    assert sum(dist.values()) == 100

    # 100 points, 4 students -> 25 each
    id4 = uuid.UUID("44444444-4444-4444-4444-444444444444")
    dist4 = distribute_points_to_students(100, [id4, id3, id2, id1])
    assert all(v == 25 for v in dist4.values())
    assert sum(dist4.values()) == 100


@pytest.mark.asyncio
async def test_team_formation_awards_points(client, seed_users, db_session):
    login_resp = await client.post("/auth/token", json={
        "email": "university@test.local",
        "password": "DevPassword123!",
    })
    token = login_resp.json()["access_token"]

    problem = StandardizedProblem(
        id=uuid.uuid4(),
        title="Water Quality Problem For Points Test",
        domain=ProblemDomain.WATER_MANAGEMENT.value,
        problem_summary="Test problem summary for points",
        priority_score=85.0,
        status=ProblemStatus.OPEN,
    )
    db_session.add(problem)
    await db_session.commit()

    resp = await client.post(
        "/teams",
        json={"problem_id": str(problem.id), "name": "Points Test Team"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 201
    team_id = resp.json()["team_id"]

    stmt_user = select(User).where(User.email == "university@test.local")
    res_user = await db_session.execute(stmt_user)
    uni_user = res_user.scalars().first()

    stmt_pts = select(PointsEvent).where(
        PointsEvent.user_id == uni_user.id,
        PointsEvent.reason == PointReason.TEAM_FORMED.value,
        PointsEvent.entity_id == uuid.UUID(team_id),
    )
    res_pts = await db_session.execute(stmt_pts)
    pts_event = res_pts.scalars().first()
    assert pts_event is not None
    assert pts_event.points == POINT_CONFIG[PointReason.TEAM_FORMED]["university_points"]


@pytest.mark.asyncio
async def test_industry_review_needs_changes_and_reject_do_not_award_approval_points(
    client, seed_users, db_session
):
    stmt_uni = select(User).where(User.email == "university@test.local")
    uni_user = (await db_session.execute(stmt_uni)).scalars().first()

    stmt_stu = select(User).where(User.email == "student@test.local")
    student = (await db_session.execute(stmt_stu)).scalars().first()

    stmt_ind = select(User).where(User.email == "industry@test.local")
    industry_user = (await db_session.execute(stmt_ind)).scalars().first()

    problem = StandardizedProblem(
        id=uuid.uuid4(),
        title="Problem for Rejection Points Test",
        domain=ProblemDomain.ENERGY_ELECTRICITY.value,
        problem_summary="Grid instability",
        priority_score=70.0,
        status=ProblemStatus.ADOPTED,
    )
    db_session.add(problem)

    team = Team(
        id=uuid.uuid4(),
        problem_id=problem.id,
        university_id=uni_user.id,
        mentor_id=uni_user.id,
        name="Energy Team",
        status=TeamStatus.ACTIVE,
    )
    db_session.add(team)

    sol = Solution(
        id=uuid.uuid4(),
        problem_id=problem.id,
        team_id=team.id,
        proposed_by=student.id,
        title="Faulty Solution Proposal",
        description="Proposal with missing schematics.",
        status=SolutionStatus.SUBMITTED,
        industry_review_status=IndustryReviewStatus.PENDING,
    )
    db_session.add(sol)
    await db_session.commit()

    login_ind = await client.post("/auth/token", json={
        "email": "industry@test.local",
        "password": "DevPassword123!",
    })
    token_ind = login_ind.json()["access_token"]

    # 1. Reject Solution -> Industry reviewer gets review points, but NO approval points for mentor or student
    resp = await client.post(
        f"/solutions/{sol.id}/industry-review",
        json={"decision": "REJECT", "review_comment": "Fundamental design flaws."},
        headers={"Authorization": f"Bearer {token_ind}"},
    )
    assert resp.status_code == 200

    # Verify NO INDUSTRY_APPROVED points
    appr_stmt = select(PointsEvent).where(
        PointsEvent.reason == PointReason.INDUSTRY_APPROVED.value,
        PointsEvent.entity_id == sol.id,
    )
    assert (await db_session.execute(appr_stmt)).scalars().first() is None

    # Verify industry reviewer received review completed points (50 pts)
    rev_stmt = select(PointsEvent).where(
        PointsEvent.user_id == industry_user.id,
        PointsEvent.reason == PointReason.INDUSTRY_REVIEW_COMPLETED.value,
        PointsEvent.entity_id == sol.id,
    )
    assert (await db_session.execute(rev_stmt)).scalars().first() is not None


@pytest.mark.asyncio
async def test_industry_approval_awards_points_to_mentor_students_and_reviewer(
    client, seed_users, db_session
):
    stmt_uni = select(User).where(User.email == "university@test.local")
    uni_user = (await db_session.execute(stmt_uni)).scalars().first()

    stmt_s1 = select(User).where(User.email == "student@test.local")
    student1 = (await db_session.execute(stmt_s1)).scalars().first()

    student2 = User(
        id=uuid.uuid4(),
        email="second_student_points@test.local",
        full_name="Second Student",
        password_hash=hash_password("DevPassword123!"),
        role=UserRole.STUDENT,
        is_verified=True,
        is_active=True,
    )
    db_session.add(student2)

    stmt_ind = select(User).where(User.email == "industry@test.local")
    industry_user = (await db_session.execute(stmt_ind)).scalars().first()

    problem = StandardizedProblem(
        id=uuid.uuid4(),
        title="Problem For Full Points Test",
        domain=ProblemDomain.AGRICULTURE.value,
        problem_summary="Storage deficit",
        priority_score=75.0,
        status=ProblemStatus.ADOPTED,
    )
    db_session.add(problem)

    team = Team(
        id=uuid.uuid4(),
        problem_id=problem.id,
        university_id=uni_user.id,
        mentor_id=uni_user.id,
        name="AgriTech Team",
        status=TeamStatus.ACTIVE,
    )
    db_session.add(team)

    sol = Solution(
        id=uuid.uuid4(),
        problem_id=problem.id,
        team_id=team.id,
        proposed_by=student1.id,
        title="Smart Cold Storage Module",
        description="Low cost solar cooling.",
        status=SolutionStatus.SUBMITTED,
        industry_review_status=IndustryReviewStatus.PENDING,
    )
    db_session.add(sol)
    await db_session.commit()

    login_uni = await client.post("/auth/token", json={
        "email": "university@test.local",
        "password": "DevPassword123!",
    })
    token_uni = login_uni.json()["access_token"]

    await client.post(
        f"/teams/{team.id}/members",
        json={"student_id": str(student1.id)},
        headers={"Authorization": f"Bearer {token_uni}"},
    )
    await client.post(
        f"/teams/{team.id}/members",
        json={"student_id": str(student2.id)},
        headers={"Authorization": f"Bearer {token_uni}"},
    )

    login_ind = await client.post("/auth/token", json={
        "email": "industry@test.local",
        "password": "DevPassword123!",
    })
    token_ind = login_ind.json()["access_token"]

    resp = await client.post(
        f"/solutions/{sol.id}/industry-review",
        json={"decision": "APPROVE", "review_comment": "Approved for field trial."},
        headers={"Authorization": f"Bearer {token_ind}"},
    )
    assert resp.status_code == 200

    # Industry reviewer: 50 pts
    ind_pts_stmt = select(PointsEvent).where(
        PointsEvent.user_id == industry_user.id,
        PointsEvent.reason == PointReason.INDUSTRY_REVIEW_COMPLETED.value,
        PointsEvent.entity_id == sol.id,
    )
    ind_ev = (await db_session.execute(ind_pts_stmt)).scalars().first()
    assert ind_ev is not None
    assert ind_ev.points == 50

    # University mentor: 100 pts
    mentor_pts_stmt = select(PointsEvent).where(
        PointsEvent.user_id == uni_user.id,
        PointsEvent.reason == PointReason.INDUSTRY_APPROVED.value,
        PointsEvent.entity_id == sol.id,
    )
    mentor_ev = (await db_session.execute(mentor_pts_stmt)).scalars().first()
    assert mentor_ev is not None
    assert mentor_ev.points == 100

    # 2 Students: 50 pts each
    for sid in [student1.id, student2.id]:
        stu_pts_stmt = select(PointsEvent).where(
            PointsEvent.user_id == sid,
            PointsEvent.reason == PointReason.INDUSTRY_APPROVED.value,
            PointsEvent.entity_id == sol.id,
        )
        stu_ev = (await db_session.execute(stu_pts_stmt)).scalars().first()
        assert stu_ev is not None
        assert stu_ev.points == 50


@pytest.mark.asyncio
async def test_points_idempotency_prevents_duplicate_award(db_session, seed_users):
    stmt = select(User).where(User.email == "university@test.local")
    user = (await db_session.execute(stmt)).scalars().first()
    entity_id = uuid.uuid4()

    ev1 = await PointsService.award_milestone_points(
        db=db_session,
        user_id=user.id,
        points=50,
        reason=PointReason.TEAM_FORMED,
        entity_type="TEAM",
        entity_id=entity_id,
    )
    assert ev1 is not None
    await db_session.commit()

    ev2 = await PointsService.award_milestone_points(
        db=db_session,
        user_id=user.id,
        points=50,
        reason=PointReason.TEAM_FORMED,
        entity_type="TEAM",
        entity_id=entity_id,
    )
    assert ev2 is None
