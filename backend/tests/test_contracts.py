import pytest
import uuid
from app.models.domain import ProblemDomain
from app.models.standardized_problem import ProblemStatus, StandardizedProblem
from app.models.team import Team, TeamStatus
from app.models.user import User, UserRole
from app.models.solution import Solution, SolutionStatus, IndustryReviewStatus


@pytest.fixture
async def setup_contract_data(db_session, seed_users):
    # Standardized Problem
    prob = StandardizedProblem(
        id=uuid.uuid4(),
        title="Contract Verification Water Shortage",
        domain=ProblemDomain.WATER_MANAGEMENT.value,
        problem_summary="Groundwater deficit in rural test area",
        observed_impact="Crop irrigation affected",
        latitude=23.3441,
        longitude=85.3096,
        priority_score=85.0,
        report_count=20,
        evidence_count=5,
        status=ProblemStatus.OPEN,
    )
    db_session.add(prob)
    await db_session.commit()
    return {"problem_id": prob.id}


@pytest.mark.asyncio
async def test_auth_token_and_me_contract(client, seed_users):
    # 1. POST /auth/token
    login_resp = await client.post("/auth/token", json={
        "email": "citizen@test.local",
        "password": "DevPassword123!",
    })
    assert login_resp.status_code == 200
    token_data = login_resp.json()
    assert "access_token" in token_data
    assert "token_type" in token_data
    assert token_data["token_type"] == "bearer"
    token = token_data["access_token"]

    # 2. GET /auth/me
    me_resp = await client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_resp.status_code == 200
    me_data = me_resp.json()
    assert "id" in me_data
    assert "email" in me_data
    assert "full_name" in me_data
    assert "role" in me_data
    assert "is_verified" in me_data
    assert "password_hash" not in me_data
    assert "password" not in me_data


@pytest.mark.asyncio
async def test_citizen_report_contract(client, seed_users):
    login_resp = await client.post("/auth/token", json={
        "email": "citizen@test.local",
        "password": "DevPassword123!",
    })
    token = login_resp.json()["access_token"]

    resp = await client.post(
        "/reports",
        json={
            "description": "Severe drinking water scarcity in Ward 3 village.",
            "domain": "WATER_MANAGEMENT",
            "latitude": 23.34,
            "longitude": 85.30,
            "title": "Ward 3 Water Emergency",
        },
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 201
    data = resp.json()
    assert "report_id" in data
    assert "status" in data
    assert "processing_status" in data
    assert "message" in data
    assert "reporter_id" not in data
    assert "password" not in data


@pytest.mark.asyncio
async def test_problems_feed_contract(client, seed_users, setup_contract_data):
    login_resp = await client.post("/auth/token", json={
        "email": "student@test.local",
        "password": "DevPassword123!",
    })
    token = login_resp.json()["access_token"]

    resp = await client.get("/problems", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    data = resp.json()
    assert "items" in data
    assert "total" in data
    assert "limit" in data
    assert "offset" in data
    assert len(data["items"]) >= 1

    item = data["items"][0]
    assert "id" in item
    assert "title" in item
    assert "domain" in item
    assert "problem_summary" in item
    assert "priority_score" in item
    assert "report_count" in item
    assert "status" in item
    assert "created_at" in item
    assert "reporter_id" not in item


@pytest.mark.asyncio
async def test_team_and_member_contract(client, seed_users, setup_contract_data, db_session):
    login_uni = await client.post("/auth/token", json={
        "email": "university@test.local",
        "password": "DevPassword123!",
    })
    token_uni = login_uni.json()["access_token"]
    prob_id = str(setup_contract_data["problem_id"])

    # 1. POST /teams
    team_resp = await client.post(
        "/teams",
        json={"problem_id": prob_id, "name": "Contract Verification Team"},
        headers={"Authorization": f"Bearer {token_uni}"},
    )
    assert team_resp.status_code == 201
    team_data = team_resp.json()
    assert "team_id" in team_data
    assert "problem_id" in team_data
    assert "university_id" in team_data
    assert "mentor_id" in team_data
    assert "name" in team_data
    assert "status" in team_data
    assert "created_at" in team_data
    team_id = team_data["team_id"]

    # 2. POST /teams/{team_id}/members
    login_stu = await client.post("/auth/token", json={
        "email": "student@test.local",
        "password": "DevPassword123!",
    })
    from sqlalchemy import select
    stmt_stu = select(User).where(User.email == "student@test.local")
    student = (await db_session.execute(stmt_stu)).scalars().first()

    mem_resp = await client.post(
        f"/teams/{team_id}/members",
        json={"student_id": str(student.id), "role_in_team": "Lead Architect"},
        headers={"Authorization": f"Bearer {token_uni}"},
    )
    assert mem_resp.status_code == 201
    mem_data = mem_resp.json()
    assert "team_member_id" in mem_data
    assert "team_id" in mem_data
    assert "student_id" in mem_data
    assert "role_in_team" in mem_data
    assert "team_status" in mem_data
    assert "joined_at" in mem_data


@pytest.mark.asyncio
async def test_solution_proposal_and_review_contract(client, seed_users, setup_contract_data, db_session):
    login_uni = await client.post("/auth/token", json={
        "email": "university@test.local",
        "password": "DevPassword123!",
    })
    token_uni = login_uni.json()["access_token"]
    prob_id = str(setup_contract_data["problem_id"])

    team_resp = await client.post(
        "/teams",
        json={"problem_id": prob_id, "name": "Solution Contract Team"},
        headers={"Authorization": f"Bearer {token_uni}"},
    )
    team_id = team_resp.json()["team_id"]

    # 1. POST /solutions (Mentor Proposes Solution)
    sol_resp = await client.post(
        "/solutions",
        json={
            "team_id": team_id,
            "title": "Solar Water Electro-Coagulation Treatment",
            "description": "Comprehensive design proposal for village borehole filtration and telemetry.",
        },
        headers={"Authorization": f"Bearer {token_uni}"},
    )
    assert sol_resp.status_code == 201
    sol_data = sol_resp.json()
    assert "solution_id" in sol_data
    assert "team_id" in sol_data
    assert "problem_id" in sol_data
    assert "proposed_by" in sol_data
    assert sol_data["status"] == "SUBMITTED"
    assert sol_data["industry_review_status"] == "PENDING"
    sol_id = sol_data["solution_id"]

    # 2. POST /solutions/{id}/industry-review
    login_ind = await client.post("/auth/token", json={
        "email": "industry@test.local",
        "password": "DevPassword123!",
    })
    token_ind = login_ind.json()["access_token"]

    rev_resp = await client.post(
        f"/solutions/{sol_id}/industry-review",
        json={"decision": "APPROVE", "review_comment": "Approved for field trial deployment."},
        headers={"Authorization": f"Bearer {token_ind}"},
    )
    assert rev_resp.status_code == 200
    data = rev_resp.json()
    assert "solution_id" in data
    assert "status" in data
    assert "industry_review_status" in data
    assert "decision" in data
    assert data["status"] == "APPROVED"
    assert data["decision"] == "APPROVE"


@pytest.mark.asyncio
async def test_public_problems_and_analytics_contracts(client, setup_contract_data):
    # 1. GET /public/problems (No auth)
    prob_resp = await client.get("/public/problems")
    assert prob_resp.status_code == 200
    prob_data = prob_resp.json()
    assert "items" in prob_data
    assert "total" in prob_data
    assert "limit" in prob_data
    assert "offset" in prob_data

    # 2. GET /public/analytics (No auth)
    ana_resp = await client.get("/public/analytics")
    assert ana_resp.status_code == 200
    ana_data = ana_resp.json()
    assert "total_problems" in ana_data
    assert "total_reports" in ana_data
    assert "open_problems" in ana_data
    assert "in_progress_problems" in ana_data
    assert "resolved_problems" in ana_data
    assert "total_evidence_items" in ana_data
    assert "total_teams" in ana_data
    assert "total_solutions" in ana_data
    assert "industry_approved_solutions" in ana_data
    assert "approved_prototypes" in ana_data
    assert "domain_breakdown" in ana_data
    assert isinstance(ana_data["domain_breakdown"], list)


@pytest.mark.asyncio
async def test_rankings_contracts(client, seed_users):
    # 1. GET /rankings/universities
    uni_resp = await client.get("/rankings/universities")
    assert uni_resp.status_code == 200
    uni_data = uni_resp.json()
    assert "items" in uni_data
    assert "total" in uni_data

    # 2. GET /rankings/industry
    ind_resp = await client.get("/rankings/industry")
    assert ind_resp.status_code == 200
    ind_data = ind_resp.json()
    assert "items" in ind_data
    assert "total" in ind_data
