import pytest
import uuid
from sqlalchemy import select
from app.core.security import hash_password
from app.models.audit_log import AuditLog
from app.models.domain import ProblemDomain
from app.models.solution import IndustryReviewStatus, Solution, SolutionStatus
from app.models.standardized_problem import ProblemStatus, StandardizedProblem
from app.models.team import Team, TeamStatus
from app.models.user import User, UserRole


@pytest.fixture
async def setup_solution_data(db_session, seed_users):
    # 1. Problem
    problem = StandardizedProblem(
        id=uuid.uuid4(),
        title="Rural Healthcare Delivery Deficit",
        domain=ProblemDomain.HEALTHCARE_SANITATION.value,
        problem_summary="Lack of transport for remote patients",
        priority_score=85.0,
        status=ProblemStatus.ADOPTED,
    )
    db_session.add(problem)

    # 2. Mentor & Team
    stmt_uni = select(User).where(User.email == "university@test.local")
    res_uni = await db_session.execute(stmt_uni)
    uni_user = res_uni.scalars().first()

    stmt_stu = select(User).where(User.email == "student@test.local")
    res_stu = await db_session.execute(stmt_stu)
    student_user = res_stu.scalars().first()

    team = Team(
        id=uuid.uuid4(),
        problem_id=problem.id,
        university_id=uni_user.id,
        mentor_id=uni_user.id,
        name="TeleMed Pioneers",
        status=TeamStatus.ACTIVE,
    )
    db_session.add(team)

    # 3. Submitted Solution (Reviewable)
    submitted_sol = Solution(
        id=uuid.uuid4(),
        problem_id=problem.id,
        team_id=team.id,
        proposed_by=student_user.id,
        title="Solar Telemedicine Mobile Hub",
        description="Electric van equipped with portable diagnostic tools and satellite internet.",
        status=SolutionStatus.SUBMITTED,
        industry_review_status=IndustryReviewStatus.PENDING,
    )
    db_session.add(submitted_sol)

    # 4. Draft Solution (Not reviewable)
    draft_sol = Solution(
        id=uuid.uuid4(),
        problem_id=problem.id,
        team_id=team.id,
        proposed_by=student_user.id,
        title="Draft Solution Idea",
        description="Work in progress draft.",
        status=SolutionStatus.DRAFT,
        industry_review_status=IndustryReviewStatus.PENDING,
    )
    db_session.add(draft_sol)

    # 5. Unverified Industry User
    unverified_industry = User(
        id=uuid.uuid4(),
        email="unverified_industry@test.local",
        full_name="Unverified Industry",
        password_hash=hash_password("DevPassword123!"),
        role=UserRole.INDUSTRY,
        is_verified=False,
        is_active=True,
    )
    db_session.add(unverified_industry)

    # 6. Inactive Industry User
    inactive_industry = User(
        id=uuid.uuid4(),
        email="inactive_industry@test.local",
        full_name="Inactive Industry",
        password_hash=hash_password("DevPassword123!"),
        role=UserRole.INDUSTRY,
        is_verified=True,
        is_active=False,
    )
    db_session.add(inactive_industry)

    await db_session.commit()

    return {
        "submitted_solution_id": submitted_sol.id,
        "draft_solution_id": draft_sol.id,
        "unverified_industry_email": unverified_industry.email,
        "inactive_industry_email": inactive_industry.email,
    }


@pytest.mark.asyncio
async def test_industry_approve_solution_success(client, seed_users, setup_solution_data, db_session):
    login_resp = await client.post("/auth/token", json={
        "email": "industry@test.local",
        "password": "DevPassword123!",
    })
    assert login_resp.status_code == 200
    token = login_resp.json()["access_token"]

    sol_id = str(setup_solution_data["submitted_solution_id"])

    resp = await client.post(
        f"/solutions/{sol_id}/industry-review",
        json={
            "decision": "APPROVE",
            "review_comment": "Excellent technical feasibility and robust pilot deployment strategy.",
        },
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "APPROVED"
    assert data["industry_review_status"] == "APPROVED"
    assert data["decision"] == "APPROVE"

    stmt = select(Solution).where(Solution.id == uuid.UUID(sol_id))
    res = await db_session.execute(stmt)
    sol = res.scalars().first()
    assert sol.status == SolutionStatus.APPROVED
    assert sol.industry_review_status == IndustryReviewStatus.APPROVED

    audit_stmt = select(AuditLog).where(
        AuditLog.action == "INDUSTRY_SOLUTION_APPROVED",
        AuditLog.entity_id == uuid.UUID(sol_id),
    )
    audit_res = await db_session.execute(audit_stmt)
    assert audit_res.scalars().first() is not None


@pytest.mark.asyncio
async def test_industry_approve_optional_comment(client, seed_users, setup_solution_data):
    login_resp = await client.post("/auth/token", json={
        "email": "industry@test.local",
        "password": "DevPassword123!",
    })
    token = login_resp.json()["access_token"]
    sol_id = str(setup_solution_data["submitted_solution_id"])

    # APPROVE with no review_comment -> 200
    resp = await client.post(
        f"/solutions/{sol_id}/industry-review",
        json={"decision": "APPROVE"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 200
    assert resp.json()["status"] == "APPROVED"


@pytest.mark.asyncio
async def test_industry_needs_changes_requires_comment(client, seed_users, setup_solution_data):
    login_resp = await client.post("/auth/token", json={
        "email": "industry@test.local",
        "password": "DevPassword123!",
    })
    token = login_resp.json()["access_token"]
    sol_id = str(setup_solution_data["submitted_solution_id"])

    # 1. NEEDS_CHANGES without comment -> 422
    resp_err = await client.post(
        f"/solutions/{sol_id}/industry-review",
        json={"decision": "NEEDS_CHANGES"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp_err.status_code == 422
    assert resp_err.json()["error"]["code"] == "COMMENT_REQUIRED"

    # 2. Blank whitespace comment -> 422
    resp_blank = await client.post(
        f"/solutions/{sol_id}/industry-review",
        json={"decision": "NEEDS_CHANGES", "review_comment": "      "},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp_blank.status_code == 422
    assert resp_blank.json()["error"]["code"] == "COMMENT_REQUIRED"

    # 3. NEEDS_CHANGES with valid comment -> 200
    resp_ok = await client.post(
        f"/solutions/{sol_id}/industry-review",
        json={
            "decision": "NEEDS_CHANGES",
            "review_comment": "Please provide detailed component BOM and battery thermal analysis.",
        },
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp_ok.status_code == 200
    data = resp_ok.json()
    assert data["status"] == "INDUSTRY_REVIEW"
    assert data["industry_review_status"] == "PENDING"
    assert data["decision"] == "NEEDS_CHANGES"


@pytest.mark.asyncio
async def test_industry_reject_solution(client, seed_users, setup_solution_data):
    login_resp = await client.post("/auth/token", json={
        "email": "industry@test.local",
        "password": "DevPassword123!",
    })
    token = login_resp.json()["access_token"]
    sol_id = str(setup_solution_data["submitted_solution_id"])

    # Reject without comment -> 422
    resp_err = await client.post(
        f"/solutions/{sol_id}/industry-review",
        json={"decision": "REJECT"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp_err.status_code == 422

    # Reject with comment -> 200
    resp = await client.post(
        f"/solutions/{sol_id}/industry-review",
        json={
            "decision": "REJECT",
            "review_comment": "Proposed hardware fails fundamental safety and regulatory compliance checks.",
        },
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "REJECTED"
    assert data["industry_review_status"] == "REJECTED"
    assert data["decision"] == "REJECT"


@pytest.mark.asyncio
async def test_solution_review_history_is_preserved(client, seed_users, setup_solution_data, db_session):
    login_resp = await client.post("/auth/token", json={
        "email": "industry@test.local",
        "password": "DevPassword123!",
    })
    token = login_resp.json()["access_token"]
    sol_id = str(setup_solution_data["submitted_solution_id"])

    # 1. First review: NEEDS_CHANGES
    resp1 = await client.post(
        f"/solutions/{sol_id}/industry-review",
        json={
            "decision": "NEEDS_CHANGES",
            "review_comment": "Needs thermal analysis before final approval.",
        },
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp1.status_code == 200

    # 2. Second review on same solution: APPROVE (after revision)
    resp2 = await client.post(
        f"/solutions/{sol_id}/industry-review",
        json={
            "decision": "APPROVE",
            "review_comment": "Thermal analysis verified and approved.",
        },
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp2.status_code == 200

    # Verify both AuditLog events exist and are preserved in order
    audit_stmt = select(AuditLog).where(
        AuditLog.entity_id == uuid.UUID(sol_id)
    ).order_by(AuditLog.created_at.asc())
    audit_res = await db_session.execute(audit_stmt)
    logs = audit_res.scalars().all()
    assert len(logs) == 2
    assert logs[0].action == "INDUSTRY_SOLUTION_NEEDS_CHANGES"
    assert logs[1].action == "INDUSTRY_SOLUTION_APPROVED"


@pytest.mark.asyncio
async def test_unverified_industry_cannot_review(client, seed_users, setup_solution_data):
    login_resp = await client.post("/auth/token", json={
        "email": setup_solution_data["unverified_industry_email"],
        "password": "DevPassword123!",
    })
    token = login_resp.json()["access_token"]
    sol_id = str(setup_solution_data["submitted_solution_id"])

    resp = await client.post(
        f"/solutions/{sol_id}/industry-review",
        json={"decision": "APPROVE"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 403


@pytest.mark.asyncio
async def test_non_industry_roles_cannot_review(client, seed_users, setup_solution_data):
    sol_id = str(setup_solution_data["submitted_solution_id"])
    non_ind = [
        "citizen@test.local",
        "student@test.local",
        "university@test.local",
        "government@test.local",
    ]
    for email in non_ind:
        login_resp = await client.post("/auth/token", json={
            "email": email,
            "password": "DevPassword123!",
        })
        token = login_resp.json()["access_token"]
        resp = await client.post(
            f"/solutions/{sol_id}/industry-review",
            json={"decision": "APPROVE"},
            headers={"Authorization": f"Bearer {token}"},
        )
        assert resp.status_code == 403


@pytest.mark.asyncio
async def test_review_non_reviewable_draft_solution_returns_400(client, seed_users, setup_solution_data):
    login_resp = await client.post("/auth/token", json={
        "email": "industry@test.local",
        "password": "DevPassword123!",
    })
    token = login_resp.json()["access_token"]
    draft_id = str(setup_solution_data["draft_solution_id"])

    resp = await client.post(
        f"/solutions/{draft_id}/industry-review",
        json={"decision": "APPROVE"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 400
    assert resp.json()["error"]["code"] == "SOLUTION_NOT_REVIEWABLE"
