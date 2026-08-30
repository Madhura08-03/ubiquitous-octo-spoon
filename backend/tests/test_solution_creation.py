import pytest
import uuid
from sqlalchemy import select
from app.models.domain import ProblemDomain
from app.models.solution import IndustryReviewStatus, Solution, SolutionStatus
from app.models.standardized_problem import ProblemStatus, StandardizedProblem
from app.models.team import Team, TeamStatus
from app.models.user import User, UserRole
from app.core.security import hash_password


@pytest.fixture
async def setup_solution_test_data(db_session, seed_users):
    # Retrieve seed users
    uni = (await db_session.execute(select(User).where(User.email == "university@test.local"))).scalars().first()
    uni2 = User(
        id=uuid.uuid4(),
        email="university2@test.local",
        full_name="Second University Mentor",
        password_hash=hash_password("DevPassword123!"),
        role=UserRole.UNIVERSITY,
        is_verified=True,
        is_active=True,
    )
    db_session.add(uni2)
    stu = (await db_session.execute(select(User).where(User.email == "student@test.local"))).scalars().first()
    cit = (await db_session.execute(select(User).where(User.email == "citizen@test.local"))).scalars().first()
    ind = (await db_session.execute(select(User).where(User.email == "industry@test.local"))).scalars().first()
    gov = (await db_session.execute(select(User).where(User.email == "government@test.local"))).scalars().first()

    # Standardized Problem
    prob = StandardizedProblem(
        id=uuid.uuid4(),
        title="Solution Creation Verification Problem",
        domain=ProblemDomain.WATER_MANAGEMENT.value,
        problem_summary="Water testing reveals arsenic contamination in 10 test wells.",
        observed_impact="Gastrointestinal illnesses reported.",
        latitude=23.3441,
        longitude=85.3096,
        priority_score=85.0,
        report_count=25,
        evidence_count=8,
        status=ProblemStatus.ADOPTED,
    )
    db_session.add(prob)

    # Team owned by University 1
    team = Team(
        id=uuid.uuid4(),
        problem_id=prob.id,
        university_id=uni.id,
        mentor_id=uni.id,
        name="AquaTech Innovations Team",
        status=TeamStatus.FORMING,
    )
    db_session.add(team)

    await db_session.commit()

    return {
        "uni": uni,
        "uni2": uni2,
        "stu": stu,
        "cit": cit,
        "ind": ind,
        "gov": gov,
        "problem_id": prob.id,
        "team_id": team.id,
    }


@pytest.mark.asyncio
async def test_verified_university_mentor_can_create_solution(client, setup_solution_test_data):
    data = setup_solution_test_data
    login_resp = await client.post("/auth/token", json={
        "email": data["uni"].email,
        "password": "DevPassword123!",
    })
    token = login_resp.json()["access_token"]

    resp = await client.post(
        "/solutions",
        json={
            "team_id": str(data["team_id"]),
            "title": "Solar Electro-Coagulation Treatment Unit",
            "description": "Photovoltaic powered filtration module for removing dissolved arsenic from groundwater.",
        },
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 201
    sol = resp.json()
    assert sol["title"] == "Solar Electro-Coagulation Treatment Unit"
    assert sol["status"] == "SUBMITTED"
    assert sol["industry_review_status"] == "PENDING"
    assert sol["proposed_by"] == str(data["uni"].id)
    assert sol["team_id"] == str(data["team_id"])
    assert sol["problem_id"] == str(data["problem_id"])


@pytest.mark.asyncio
async def test_non_university_roles_cannot_create_solution(client, setup_solution_test_data):
    data = setup_solution_test_data
    payload = {
        "team_id": str(data["team_id"]),
        "title": "Unauthorized Solution Proposal",
        "description": "This proposal should be rejected because user does not have UNIVERSITY role.",
    }

    # 1. Student -> 403
    login_stu = await client.post("/auth/token", json={"email": data["stu"].email, "password": "DevPassword123!"})
    resp_stu = await client.post("/solutions", json=payload, headers={"Authorization": f"Bearer {login_stu.json()['access_token']}"})
    assert resp_stu.status_code == 403

    # 2. Citizen -> 403
    login_cit = await client.post("/auth/token", json={"email": data["cit"].email, "password": "DevPassword123!"})
    resp_cit = await client.post("/solutions", json=payload, headers={"Authorization": f"Bearer {login_cit.json()['access_token']}"})
    assert resp_cit.status_code == 403

    # 3. Industry -> 403
    login_ind = await client.post("/auth/token", json={"email": data["ind"].email, "password": "DevPassword123!"})
    resp_ind = await client.post("/solutions", json=payload, headers={"Authorization": f"Bearer {login_ind.json()['access_token']}"})
    assert resp_ind.status_code == 403

    # 4. Government -> 403
    login_gov = await client.post("/auth/token", json={"email": data["gov"].email, "password": "DevPassword123!"})
    resp_gov = await client.post("/solutions", json=payload, headers={"Authorization": f"Bearer {login_gov.json()['access_token']}"})
    assert resp_gov.status_code == 403


@pytest.mark.asyncio
async def test_other_university_mentor_cannot_propose_solution_for_another_team(client, setup_solution_test_data):
    data = setup_solution_test_data
    # Login as University 2 (different mentor)
    login_uni2 = await client.post("/auth/token", json={
        "email": data["uni2"].email,
        "password": "DevPassword123!",
    })
    token_uni2 = login_uni2.json()["access_token"]

    resp = await client.post(
        "/solutions",
        json={
            "team_id": str(data["team_id"]),
            "title": "Cross University Solution Hijack",
            "description": "Attempting to submit a solution for a team owned by another university mentor.",
        },
        headers={"Authorization": f"Bearer {token_uni2}"},
    )
    assert resp.status_code == 403
    assert resp.json()["error"]["code"] == "TEAM_ACCESS_DENIED"


@pytest.mark.asyncio
async def test_client_cannot_override_proposed_by_or_problem_id(client, setup_solution_test_data):
    data = setup_solution_test_data
    login_uni = await client.post("/auth/token", json={
        "email": data["uni"].email,
        "password": "DevPassword123!",
    })
    token_uni = login_uni.json()["access_token"]

    fake_user_id = str(uuid.uuid4())
    fake_problem_id = str(uuid.uuid4())

    # Schema forbids extra fields (model_config = ConfigDict(extra="forbid")) -> 422 if supplied
    resp = await client.post(
        "/solutions",
        json={
            "team_id": str(data["team_id"]),
            "title": "Tampered Proposer Identity Solution",
            "description": "Attempting to supply client-controlled proposed_by parameter.",
            "proposed_by": fake_user_id,
        },
        headers={"Authorization": f"Bearer {token_uni}"},
    )
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_create_solution_nonexistent_team_returns_404(client, setup_solution_test_data):
    data = setup_solution_test_data
    login_uni = await client.post("/auth/token", json={
        "email": data["uni"].email,
        "password": "DevPassword123!",
    })
    token_uni = login_uni.json()["access_token"]

    resp = await client.post(
        "/solutions",
        json={
            "team_id": str(uuid.uuid4()),
            "title": "Nonexistent Team Solution Proposal",
            "description": "Attempting to submit a solution for a non-existent team ID.",
        },
        headers={"Authorization": f"Bearer {token_uni}"},
    )
    assert resp.status_code == 404
