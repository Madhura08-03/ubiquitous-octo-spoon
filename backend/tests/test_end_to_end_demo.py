import pytest
import uuid
from sqlalchemy import select
from app.core.points_config import PointReason
from app.core.security import hash_password
from app.models.domain import ProblemDomain
from app.models.points_event import PointsEvent
from app.models.standardized_problem import ProblemStatus, StandardizedProblem
from app.models.user import User, UserRole


@pytest.fixture
async def setup_e2e_actors_and_problem(db_session):
    # 1. Citizen
    citizen = User(
        id=uuid.uuid4(),
        email="e2e.citizen@samanvay.local",
        full_name="E2E Citizen Ramesh",
        password_hash=hash_password("DevPassword123!"),
        role=UserRole.CITIZEN,
        is_verified=True,
        is_active=True,
    )
    db_session.add(citizen)

    # 2. Student
    student = User(
        id=uuid.uuid4(),
        email="e2e.student@samanvay.local",
        full_name="E2E Student Pooja",
        password_hash=hash_password("DevPassword123!"),
        role=UserRole.STUDENT,
        is_verified=True,
        is_active=True,
    )
    db_session.add(student)

    # 3. University Mentor
    university = User(
        id=uuid.uuid4(),
        email="e2e.university@samanvay.local",
        full_name="E2E Institute of Technology",
        password_hash=hash_password("DevPassword123!"),
        role=UserRole.UNIVERSITY,
        is_verified=True,
        is_active=True,
    )
    db_session.add(university)

    # 4. Industry Partner
    industry = User(
        id=uuid.uuid4(),
        email="e2e.industry@samanvay.local",
        full_name="E2E CleanTech Solutions Ltd",
        password_hash=hash_password("DevPassword123!"),
        role=UserRole.INDUSTRY,
        is_verified=True,
        is_active=True,
    )
    db_session.add(industry)

    # 5. Open Standardized Problem
    problem = StandardizedProblem(
        id=uuid.uuid4(),
        title="E2E Groundwater Contamination in Ranchi Rural",
        domain=ProblemDomain.WATER_MANAGEMENT.value,
        problem_summary="Groundwater testing shows high arsenic levels in 12 borewells.",
        affected_community="Ranchi Ward 4 Residents",
        observed_impact="Gastrointestinal illnesses and skin lesions reported.",
        latitude=23.3441,
        longitude=85.3096,
        priority_score=90.0,
        report_count=35,
        evidence_count=10,
        status=ProblemStatus.OPEN,
    )
    db_session.add(problem)

    await db_session.commit()

    return {
        "citizen": citizen,
        "student": student,
        "university": university,
        "industry": industry,
        "problem_id": problem.id,
    }


@pytest.mark.asyncio
async def test_complete_end_to_end_presentation_workflow(client, setup_e2e_actors_and_problem, db_session):
    actors = setup_e2e_actors_and_problem
    prob_id = str(actors["problem_id"])

    # ----------------------------------------------------
    # STEP 1: Citizen Ingestion (POST /reports)
    # ----------------------------------------------------
    login_cit = await client.post("/auth/token", json={
        "email": actors["citizen"].email,
        "password": "DevPassword123!",
    })
    assert login_cit.status_code == 200
    token_cit = login_cit.json()["access_token"]

    rep_resp = await client.post(
        "/reports",
        json={
            "description": "Our village tubewell water has turned reddish with heavy metallic smell.",
            "domain": "WATER_MANAGEMENT",
            "latitude": 23.3441,
            "longitude": 85.3096,
            "title": "Severe tubewell water contamination in Ward 4",
        },
        headers={"Authorization": f"Bearer {token_cit}"},
    )
    assert rep_resp.status_code == 201
    rep_data = rep_resp.json()
    assert rep_data["status"] == "RECEIVED"
    assert rep_data["processing_status"] == "STUB"

    # ----------------------------------------------------
    # STEP 2: Student Problem Discovery Feed (GET /problems)
    # ----------------------------------------------------
    login_stu = await client.post("/auth/token", json={
        "email": actors["student"].email,
        "password": "DevPassword123!",
    })
    assert login_stu.status_code == 200
    token_stu = login_stu.json()["access_token"]

    feed_resp = await client.get("/problems?domain=WATER_MANAGEMENT", headers={"Authorization": f"Bearer {token_stu}"})
    assert feed_resp.status_code == 200
    feed_data = feed_resp.json()
    assert feed_data["total"] >= 1
    found_prob = next((p for p in feed_data["items"] if str(p["id"]) == prob_id), None)
    assert found_prob is not None
    assert found_prob["domain"] == "WATER_MANAGEMENT"
    assert "reporter_id" not in found_prob  # Zero PII

    # ----------------------------------------------------
    # STEP 3: University Mentor Adopts Problem & Forms Team (POST /teams)
    # ----------------------------------------------------
    login_uni = await client.post("/auth/token", json={
        "email": actors["university"].email,
        "password": "DevPassword123!",
    })
    assert login_uni.status_code == 200
    token_uni = login_uni.json()["access_token"]

    team_resp = await client.post(
        "/teams",
        json={"problem_id": prob_id, "name": "E2E Aqua Innovations Team"},
        headers={"Authorization": f"Bearer {token_uni}"},
    )
    assert team_resp.status_code == 201
    team_data = team_resp.json()
    team_id = team_data["team_id"]
    assert team_data["status"] == "FORMING"

    # Verify problem status transitioned to ADOPTED
    prob_stmt = select(StandardizedProblem).where(StandardizedProblem.id == uuid.UUID(prob_id))
    prob_row = (await db_session.execute(prob_stmt)).scalars().first()
    assert prob_row.status == ProblemStatus.ADOPTED

    # Verify TEAM_FORMED points awarded to mentor (50 pts)
    pts_stmt = select(PointsEvent).where(
        PointsEvent.user_id == actors["university"].id,
        PointsEvent.reason == PointReason.TEAM_FORMED.value,
        PointsEvent.entity_id == uuid.UUID(team_id),
    )
    assert (await db_session.execute(pts_stmt)).scalars().first() is not None

    # ----------------------------------------------------
    # STEP 4: University Mentor Proposes Solution via API (POST /solutions)
    # ----------------------------------------------------
    sol_resp = await client.post(
        "/solutions",
        json={
            "team_id": team_id,
            "title": "E2E Solar Electro-Coagulation Arsenic Filter",
            "description": "Low cost solar-powered electrochemical water purification unit with IoT telemetry.",
        },
        headers={"Authorization": f"Bearer {token_uni}"},
    )
    assert sol_resp.status_code == 201
    sol_data = sol_resp.json()
    assert sol_data["status"] == "SUBMITTED"
    assert sol_data["industry_review_status"] == "PENDING"
    assert sol_data["proposed_by"] == str(actors["university"].id)
    sol_id = sol_data["solution_id"]

    # ----------------------------------------------------
    # STEP 5: University Mentor Assigns Student Members (POST /teams/{id}/members)
    # ----------------------------------------------------
    mem_resp = await client.post(
        f"/teams/{team_id}/members",
        json={"student_id": str(actors["student"].id), "role_in_team": "IoT Sensor Lead"},
        headers={"Authorization": f"Bearer {token_uni}"},
    )
    assert mem_resp.status_code == 201
    mem_data = mem_resp.json()
    assert mem_data["team_status"] == "ACTIVE"  # Transitions FORMING -> ACTIVE

    # Verify STUDENT_TEAM_JOINED points awarded to student (20 pts)
    stu_pts_stmt = select(PointsEvent).where(
        PointsEvent.user_id == actors["student"].id,
        PointsEvent.reason == PointReason.STUDENT_TEAM_JOINED.value,
        PointsEvent.entity_id == uuid.UUID(team_id),
    )
    assert (await db_session.execute(stu_pts_stmt)).scalars().first() is not None

    # ----------------------------------------------------
    # STEP 6: Industry Technical Review & Approval (POST /solutions/{id}/industry-review)
    # ----------------------------------------------------
    login_ind = await client.post("/auth/token", json={
        "email": actors["industry"].email,
        "password": "DevPassword123!",
    })
    assert login_ind.status_code == 200
    token_ind = login_ind.json()["access_token"]

    rev_resp = await client.post(
        f"/solutions/{sol_id}/industry-review",
        json={
            "decision": "APPROVE",
            "review_comment": "Excellent technical feasibility, validated sensor specs, and approved for pilot field deployment.",
        },
        headers={"Authorization": f"Bearer {token_ind}"},
    )
    assert rev_resp.status_code == 200
    rev_data = rev_resp.json()
    assert rev_data["status"] == "APPROVED"
    assert rev_data["industry_review_status"] == "APPROVED"
    assert rev_data["decision"] == "APPROVE"

    # Verify points awarded:
    # 1. Industry reviewer -> 50 pts (INDUSTRY_REVIEW_COMPLETED)
    ind_rev_pts = select(PointsEvent).where(
        PointsEvent.user_id == actors["industry"].id,
        PointsEvent.reason == PointReason.INDUSTRY_REVIEW_COMPLETED.value,
        PointsEvent.entity_id == uuid.UUID(sol_id),
    )
    assert (await db_session.execute(ind_rev_pts)).scalars().first() is not None

    # 2. University mentor -> 100 pts (INDUSTRY_APPROVED)
    uni_appr_pts = select(PointsEvent).where(
        PointsEvent.user_id == actors["university"].id,
        PointsEvent.reason == PointReason.INDUSTRY_APPROVED.value,
        PointsEvent.entity_id == uuid.UUID(sol_id),
    )
    assert (await db_session.execute(uni_appr_pts)).scalars().first() is not None

    # 3. Student -> 100 pts (INDUSTRY_APPROVED)
    stu_appr_pts = select(PointsEvent).where(
        PointsEvent.user_id == actors["student"].id,
        PointsEvent.reason == PointReason.INDUSTRY_APPROVED.value,
        PointsEvent.entity_id == uuid.UUID(sol_id),
    )
    assert (await db_session.execute(stu_appr_pts)).scalars().first() is not None

    # ----------------------------------------------------
    # STEP 7: Public Leaderboards Verification
    # ----------------------------------------------------
    uni_rank = await client.get("/rankings/universities")
    assert uni_rank.status_code == 200
    uni_rank_data = uni_rank.json()
    assert uni_rank_data["total"] >= 1
    # Check E2E University is ranked with 150 points (50 team formed + 100 industry approved)
    e2e_uni_entry = next((u for u in uni_rank_data["items"] if u["name"] == actors["university"].full_name), None)
    assert e2e_uni_entry is not None
    assert e2e_uni_entry["points"] == 150

    ind_rank = await client.get("/rankings/industry")
    assert ind_rank.status_code == 200
    ind_rank_data = ind_rank.json()
    assert ind_rank_data["total"] >= 1
    e2e_ind_entry = next((i for i in ind_rank_data["items"] if i["name"] == actors["industry"].full_name), None)
    assert e2e_ind_entry is not None
    assert e2e_ind_entry["points"] == 50

    # ----------------------------------------------------
    # STEP 8: Public Problems & Analytics Verification
    # ----------------------------------------------------
    pub_prob = await client.get("/public/problems")
    assert pub_prob.status_code == 200
    assert pub_prob.json()["total"] >= 1

    pub_ana = await client.get("/public/analytics")
    assert pub_ana.status_code == 200
    ana_data = pub_ana.json()
    assert ana_data["total_problems"] >= 1
    assert ana_data["total_reports"] >= 1
    assert ana_data["total_teams"] >= 1
    assert ana_data["total_solutions"] >= 1
    assert ana_data["industry_approved_solutions"] >= 1
    assert ana_data["approved_prototypes"] == 0  # Zero-safe accurate state
