import pytest
import uuid
from sqlalchemy import select
from app.models.audit_log import AuditLog
from app.models.domain import ProblemDomain
from app.models.standardized_problem import ProblemStatus, StandardizedProblem
from app.models.team import Team, TeamStatus
from app.models.team_member import TeamMember
from app.models.user import User, UserRole
from app.core.security import hash_password


@pytest.fixture
async def setup_team_test_data(db_session):
    # 1. Open problem
    open_problem = StandardizedProblem(
        id=uuid.uuid4(),
        title="Open Problem For Adoption",
        domain=ProblemDomain.WATER_MANAGEMENT.value,
        problem_summary="Groundwater shortage in test village",
        priority_score=80.0,
        status=ProblemStatus.OPEN,
    )
    db_session.add(open_problem)

    # 2. Resolved problem
    resolved_problem = StandardizedProblem(
        id=uuid.uuid4(),
        title="Resolved Problem Cannot Adopt",
        domain=ProblemDomain.ROADS_INFRASTRUCTURE.value,
        problem_summary="Road fixed last month",
        priority_score=30.0,
        status=ProblemStatus.RESOLVED,
    )
    db_session.add(resolved_problem)

    # 3. Second University User (non-owner)
    other_uni = User(
        id=uuid.uuid4(),
        email="other_university@test.local",
        full_name="Prof. Other Mentor",
        password_hash=hash_password("DevPassword123!"),
        role=UserRole.UNIVERSITY,
        is_verified=True,
        is_active=True,
    )
    db_session.add(other_uni)

    # 4. Inactive Student
    inactive_student = User(
        id=uuid.uuid4(),
        email="inactive_student@test.local",
        full_name="Inactive Student",
        password_hash=hash_password("DevPassword123!"),
        role=UserRole.STUDENT,
        is_verified=True,
        is_active=False,
    )
    db_session.add(inactive_student)

    await db_session.commit()
    return {
        "open_problem_id": open_problem.id,
        "resolved_problem_id": resolved_problem.id,
        "other_uni_email": other_uni.email,
        "inactive_student_id": inactive_student.id,
    }


@pytest.mark.asyncio
async def test_university_create_team_success(client, seed_users, setup_team_test_data, db_session):
    login_resp = await client.post("/auth/token", json={
        "email": "university@test.local",
        "password": "DevPassword123!",
    })
    assert login_resp.status_code == 200
    token = login_resp.json()["access_token"]

    problem_id = str(setup_team_test_data["open_problem_id"])

    resp = await client.post(
        "/teams",
        json={"problem_id": problem_id, "name": "Aqua Innovations Team"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["name"] == "Aqua Innovations Team"
    assert data["status"] == "FORMING"
    team_id = data["team_id"]

    stmt = select(StandardizedProblem).where(StandardizedProblem.id == uuid.UUID(problem_id))
    res = await db_session.execute(stmt)
    problem = res.scalars().first()
    assert problem.status == ProblemStatus.ADOPTED

    audit_stmt = select(AuditLog).where(
        AuditLog.action == "TEAM_CREATED",
        AuditLog.entity_id == uuid.UUID(team_id),
    )
    audit_res = await db_session.execute(audit_stmt)
    assert audit_res.scalars().first() is not None


@pytest.mark.asyncio
async def test_client_cannot_override_team_ownership(client, seed_users, setup_team_test_data):
    login_resp = await client.post("/auth/token", json={
        "email": "university@test.local",
        "password": "DevPassword123!",
    })
    token = login_resp.json()["access_token"]
    problem_id = str(setup_team_test_data["open_problem_id"])

    # Attempt to inject extra mentor_id in request body
    fake_mentor_id = str(uuid.uuid4())
    resp = await client.post(
        "/teams",
        json={
            "problem_id": problem_id,
            "name": "Ownership Override Team",
            "mentor_id": fake_mentor_id,
        },
        headers={"Authorization": f"Bearer {token}"},
    )
    # Extra fields forbidden -> 422
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_non_university_roles_cannot_create_team(client, seed_users, setup_team_test_data):
    problem_id = str(setup_team_test_data["open_problem_id"])
    non_uni = [
        "citizen@test.local",
        "student@test.local",
        "industry@test.local",
        "government@test.local",
    ]
    for email in non_uni:
        login_resp = await client.post("/auth/token", json={
            "email": email,
            "password": "DevPassword123!",
        })
        token = login_resp.json()["access_token"]
        resp = await client.post(
            "/teams",
            json={"problem_id": problem_id, "name": "Unauthorized Team"},
            headers={"Authorization": f"Bearer {token}"},
        )
        assert resp.status_code == 403


@pytest.mark.asyncio
async def test_create_team_nonexistent_problem(client, seed_users):
    login_resp = await client.post("/auth/token", json={
        "email": "university@test.local",
        "password": "DevPassword123!",
    })
    token = login_resp.json()["access_token"]

    resp = await client.post(
        "/teams",
        json={"problem_id": str(uuid.uuid4()), "name": "Ghost Problem Team"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_create_team_ineligible_problem_status(client, seed_users, setup_team_test_data):
    login_resp = await client.post("/auth/token", json={
        "email": "university@test.local",
        "password": "DevPassword123!",
    })
    token = login_resp.json()["access_token"]

    resp = await client.post(
        "/teams",
        json={
            "problem_id": str(setup_team_test_data["resolved_problem_id"]),
            "name": "Team on Resolved Problem",
        },
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 400
    assert resp.json()["error"]["code"] == "INELIGIBLE_PROBLEM_STATUS"


@pytest.mark.asyncio
async def test_create_duplicate_active_team_conflict(client, seed_users, setup_team_test_data):
    login_resp = await client.post("/auth/token", json={
        "email": "university@test.local",
        "password": "DevPassword123!",
    })
    token = login_resp.json()["access_token"]
    problem_id = str(setup_team_test_data["open_problem_id"])

    # 1. First team creation -> 201
    resp1 = await client.post(
        "/teams",
        json={"problem_id": problem_id, "name": "Team Alpha"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp1.status_code == 201

    # 2. Second team creation for same problem -> 409 Conflict
    resp2 = await client.post(
        "/teams",
        json={"problem_id": problem_id, "name": "Team Beta"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp2.status_code == 409
    assert resp2.json()["error"]["code"] == "ACTIVE_TEAM_EXISTS"


@pytest.mark.asyncio
async def test_add_student_member_transitions_team_to_active(client, seed_users, setup_team_test_data, db_session):
    login_resp = await client.post("/auth/token", json={
        "email": "university@test.local",
        "password": "DevPassword123!",
    })
    token = login_resp.json()["access_token"]
    problem_id = str(setup_team_test_data["open_problem_id"])

    team_resp = await client.post(
        "/teams",
        json={"problem_id": problem_id, "name": "Solar Team"},
        headers={"Authorization": f"Bearer {token}"},
    )
    team_id = team_resp.json()["team_id"]
    assert team_resp.json()["status"] == "FORMING"

    stmt = select(User).where(User.email == "student@test.local")
    res = await db_session.execute(stmt)
    student = res.scalars().first()

    add_resp = await client.post(
        f"/teams/{team_id}/members",
        json={"student_id": str(student.id), "role_in_team": "Lead Developer"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert add_resp.status_code == 201
    data = add_resp.json()
    assert data["role_in_team"] == "Lead Developer"
    assert data["team_status"] == "ACTIVE"

    audit_stmt = select(AuditLog).where(
        AuditLog.action == "TEAM_MEMBER_ADDED",
        AuditLog.entity_id == uuid.UUID(team_id),
    )
    audit_res = await db_session.execute(audit_stmt)
    assert audit_res.scalars().first() is not None


@pytest.mark.asyncio
async def test_non_owner_university_cannot_add_member(client, seed_users, setup_team_test_data, db_session):
    # 1. Primary university creates team
    login_resp1 = await client.post("/auth/token", json={
        "email": "university@test.local",
        "password": "DevPassword123!",
    })
    token1 = login_resp1.json()["access_token"]
    problem_id = str(setup_team_test_data["open_problem_id"])

    team_resp = await client.post(
        "/teams",
        json={"problem_id": problem_id, "name": "Primary Uni Team"},
        headers={"Authorization": f"Bearer {token1}"},
    )
    team_id = team_resp.json()["team_id"]

    # 2. Second university logs in
    login_resp2 = await client.post("/auth/token", json={
        "email": setup_team_test_data["other_uni_email"],
        "password": "DevPassword123!",
    })
    token2 = login_resp2.json()["access_token"]

    stmt_stu = select(User).where(User.email == "student@test.local")
    res_stu = await db_session.execute(stmt_stu)
    student = res_stu.scalars().first()

    # 3. Second university attempts to add member -> 403 TEAM_ACCESS_DENIED
    add_resp = await client.post(
        f"/teams/{team_id}/members",
        json={"student_id": str(student.id)},
        headers={"Authorization": f"Bearer {token2}"},
    )
    assert add_resp.status_code == 403
    assert add_resp.json()["error"]["code"] == "TEAM_ACCESS_DENIED"


@pytest.mark.asyncio
async def test_add_inactive_student_returns_422(client, seed_users, setup_team_test_data):
    login_resp = await client.post("/auth/token", json={
        "email": "university@test.local",
        "password": "DevPassword123!",
    })
    token = login_resp.json()["access_token"]
    problem_id = str(setup_team_test_data["open_problem_id"])

    team_resp = await client.post(
        "/teams",
        json={"problem_id": problem_id, "name": "Inactive Check Team"},
        headers={"Authorization": f"Bearer {token}"},
    )
    team_id = team_resp.json()["team_id"]

    resp = await client.post(
        f"/teams/{team_id}/members",
        json={"student_id": str(setup_team_test_data["inactive_student_id"])},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 422
    assert resp.json()["error"]["code"] == "STUDENT_INACTIVE"


@pytest.mark.asyncio
async def test_add_duplicate_team_member_returns_409(client, seed_users, setup_team_test_data, db_session):
    login_resp = await client.post("/auth/token", json={
        "email": "university@test.local",
        "password": "DevPassword123!",
    })
    token = login_resp.json()["access_token"]
    problem_id = str(setup_team_test_data["open_problem_id"])

    team_resp = await client.post(
        "/teams",
        json={"problem_id": problem_id, "name": "Duplicate Member Test Team"},
        headers={"Authorization": f"Bearer {token}"},
    )
    team_id = team_resp.json()["team_id"]

    stmt = select(User).where(User.email == "student@test.local")
    res = await db_session.execute(stmt)
    student = res.scalars().first()

    # Add once -> 201
    resp1 = await client.post(
        f"/teams/{team_id}/members",
        json={"student_id": str(student.id)},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp1.status_code == 201

    # Add again -> 409
    resp2 = await client.post(
        f"/teams/{team_id}/members",
        json={"student_id": str(student.id)},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp2.status_code == 409
    assert resp2.json()["error"]["code"] == "ALREADY_TEAM_MEMBER"


@pytest.mark.asyncio
async def test_add_non_student_user_returns_422(client, seed_users, setup_team_test_data, db_session):
    login_resp = await client.post("/auth/token", json={
        "email": "university@test.local",
        "password": "DevPassword123!",
    })
    token = login_resp.json()["access_token"]
    problem_id = str(setup_team_test_data["open_problem_id"])

    team_resp = await client.post(
        "/teams",
        json={"problem_id": problem_id, "name": "Non-Student Add Team"},
        headers={"Authorization": f"Bearer {token}"},
    )
    team_id = team_resp.json()["team_id"]

    stmt = select(User).where(User.email == "citizen@test.local")
    res = await db_session.execute(stmt)
    citizen = res.scalars().first()

    resp = await client.post(
        f"/teams/{team_id}/members",
        json={"student_id": str(citizen.id)},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 422
    assert resp.json()["error"]["code"] == "NOT_A_STUDENT"


@pytest.mark.asyncio
async def test_team_max_capacity_returns_409(client, seed_users, setup_team_test_data, db_session):
    login_resp = await client.post("/auth/token", json={
        "email": "university@test.local",
        "password": "DevPassword123!",
    })
    token = login_resp.json()["access_token"]
    problem_id = str(setup_team_test_data["open_problem_id"])

    team_resp = await client.post(
        "/teams",
        json={"problem_id": problem_id, "name": "Capacity Test Team"},
        headers={"Authorization": f"Bearer {token}"},
    )
    team_id = team_resp.json()["team_id"]

    # Add 8 students (MAX_TEAM_STUDENTS = 8)
    for i in range(8):
        stu = User(
            id=uuid.uuid4(),
            email=f"student_cap_{i}@test.local",
            full_name=f"Student {i}",
            password_hash=hash_password("DevPassword123!"),
            role=UserRole.STUDENT,
            is_verified=True,
            is_active=True,
        )
        db_session.add(stu)
        await db_session.commit()

        resp = await client.post(
            f"/teams/{team_id}/members",
            json={"student_id": str(stu.id)},
            headers={"Authorization": f"Bearer {token}"},
        )
        assert resp.status_code == 201

    # 9th student -> 409 Team Full
    extra_stu = User(
        id=uuid.uuid4(),
        email="student_cap_extra@test.local",
        full_name="Extra Student",
        password_hash=hash_password("DevPassword123!"),
        role=UserRole.STUDENT,
        is_verified=True,
        is_active=True,
    )
    db_session.add(extra_stu)
    await db_session.commit()

    resp_full = await client.post(
        f"/teams/{team_id}/members",
        json={"student_id": str(extra_stu.id)},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp_full.status_code == 409
    assert resp_full.json()["error"]["code"] == "TEAM_FULL"


@pytest.mark.asyncio
async def test_cannot_add_member_to_completed_team(client, seed_users, setup_team_test_data, db_session):
    login_resp = await client.post("/auth/token", json={
        "email": "university@test.local",
        "password": "DevPassword123!",
    })
    token = login_resp.json()["access_token"]
    problem_id = str(setup_team_test_data["open_problem_id"])

    team_resp = await client.post(
        "/teams",
        json={"problem_id": problem_id, "name": "Completed State Team"},
        headers={"Authorization": f"Bearer {token}"},
    )
    team_id = team_resp.json()["team_id"]

    stmt = select(Team).where(Team.id == uuid.UUID(team_id))
    res = await db_session.execute(stmt)
    team = res.scalars().first()
    team.status = TeamStatus.COMPLETED
    await db_session.commit()

    stmt_stu = select(User).where(User.email == "student@test.local")
    res_stu = await db_session.execute(stmt_stu)
    student = res_stu.scalars().first()

    resp = await client.post(
        f"/teams/{team_id}/members",
        json={"student_id": str(student.id)},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 400
    assert resp.json()["error"]["code"] == "TEAM_CLOSED"
