import pytest
import uuid
from app.models.domain import ProblemDomain
from app.models.standardized_problem import ProblemStatus, StandardizedProblem


@pytest.fixture
async def setup_public_problems(db_session):
    problems = [
        StandardizedProblem(
            id=uuid.uuid4(),
            title="Public Water Supply Deficit",
            domain=ProblemDomain.WATER_MANAGEMENT.value,
            problem_summary="Potable drinking water issue for public transparency",
            observed_impact="Gastrointestinal illnesses reported",
            latitude=23.3441,
            longitude=85.3096,
            priority_score=88.0,
            report_count=30,
            evidence_count=8,
            status=ProblemStatus.OPEN,
        ),
        StandardizedProblem(
            id=uuid.uuid4(),
            title="Public Waste Dumping Concern",
            domain=ProblemDomain.ENVIRONMENT_WASTE.value,
            problem_summary="Overflowing waste at market square",
            observed_impact="Drainage blocked",
            latitude=23.3700,
            longitude=85.3300,
            priority_score=60.0,
            report_count=15,
            evidence_count=4,
            status=ProblemStatus.RESOLVED,
        ),
    ]
    for p in problems:
        db_session.add(p)
    await db_session.commit()


@pytest.mark.asyncio
async def test_get_public_problems_no_auth_and_zero_pii(client, setup_public_problems):
    # No auth header needed
    resp = await client.get("/public/problems")
    assert resp.status_code == 200
    data = resp.json()
    assert "items" in data
    assert data["total"] >= 2

    # Verify fields and complete absence of PII
    for item in data["items"]:
        assert "id" in item
        assert "title" in item
        assert "domain" in item
        assert "problem_summary" in item
        assert "priority_score" in item
        assert "status" in item
        assert "reporter_id" not in item
        assert "citizen" not in item
        assert "email" not in item
        assert "password" not in item


@pytest.mark.asyncio
async def test_get_public_problems_filters(client, setup_public_problems):
    # Domain filter
    resp = await client.get("/public/problems", params={"domain": "WATER_MANAGEMENT"})
    assert resp.status_code == 200
    data = resp.json()
    for item in data["items"]:
        assert item["domain"] == "WATER_MANAGEMENT"

    # Status filter
    resp_res = await client.get("/public/problems", params={"status": "RESOLVED"})
    assert resp_res.status_code == 200
    for item in resp_res.json()["items"]:
        assert item["status"] == "RESOLVED"
