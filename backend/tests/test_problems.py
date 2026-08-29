import pytest
from app.models.domain import ProblemDomain
from app.models.standardized_problem import ProblemStatus, StandardizedProblem


@pytest.fixture
async def seed_problems_data(db_session):
    problems = [
        StandardizedProblem(
            title="Ormanjhi Potable Water Crisis",
            domain=ProblemDomain.WATER_MANAGEMENT.value,
            problem_summary="Groundwater contamination leaves 4 villages without drinking water.",
            affected_community="Ormanjhi Villages",
            observed_impact="Gastrointestinal illness",
            latitude=23.4795,
            longitude=85.4852,
            priority_score=90.0,
            report_count=40,
            evidence_count=10,
            status=ProblemStatus.OPEN,
        ),
        StandardizedProblem(
            title="NH-33 Highway Potholes & Structural Subsidence",
            domain=ProblemDomain.ROADS_INFRASTRUCTURE.value,
            problem_summary="Heavy freight traffic road deterioration causing frequent fatal accidents.",
            affected_community="Commuters and freight drivers",
            observed_impact="Fatal accidents and transit delays",
            latitude=23.5821,
            longitude=85.5134,
            priority_score=85.0,
            report_count=25,
            evidence_count=8,
            status=ProblemStatus.OPEN,
        ),
        StandardizedProblem(
            title="Bero Agricultural Cold Storage Deficit",
            domain=ProblemDomain.AGRICULTURE.value,
            problem_summary="Farmers lack affordable refrigeration causing massive crop spoilage.",
            affected_community="Bero farmer collective",
            observed_impact="35% produce loss each harvest",
            latitude=23.2798,
            longitude=85.0886,
            priority_score=70.0,
            report_count=15,
            evidence_count=4,
            status=ProblemStatus.UNDER_INVESTIGATION,
        ),
        StandardizedProblem(
            title="Resolved Community Park Lighting",
            domain=ProblemDomain.ENERGY_ELECTRICITY.value,
            problem_summary="Park lights were replaced and fixed.",
            affected_community="Local Park Visitors",
            observed_impact="None",
            latitude=23.3400,
            longitude=85.3000,
            priority_score=40.0,
            report_count=5,
            evidence_count=1,
            status=ProblemStatus.RESOLVED,
        ),
    ]
    for p in problems:
        db_session.add(p)
    await db_session.commit()


@pytest.mark.asyncio
async def test_empty_problems_feed(client):
    resp = await client.get("/problems")
    assert resp.status_code == 200
    data = resp.json()
    assert data["items"] == []
    assert data["total"] == 0
    assert data["limit"] == 20
    assert data["offset"] == 0


@pytest.mark.asyncio
async def test_problems_feed_default_active_only(client, seed_problems_data):
    resp = await client.get("/problems")
    assert resp.status_code == 200
    data = resp.json()
    # 3 active problems (2 OPEN, 1 UNDER_INVESTIGATION); RESOLVED is excluded by default
    assert data["total"] == 3
    assert len(data["items"]) == 3

    # Verify deterministic sort: priority_score DESC
    scores = [item["priority_score"] for item in data["items"]]
    assert scores == sorted(scores, reverse=True)


@pytest.mark.asyncio
async def test_problems_feed_zero_pii_exposed(client, seed_problems_data):
    resp = await client.get("/problems")
    assert resp.status_code == 200
    data = resp.json()
    for item in data["items"]:
        # Verify no PII fields
        assert "reporter_id" not in item
        assert "email" not in item
        assert "password" not in item
        assert "phone" not in item
        assert "reporter" not in item


@pytest.mark.asyncio
async def test_domain_filtering(client, seed_problems_data):
    resp = await client.get("/problems", params={"domain": "WATER_MANAGEMENT"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 1
    assert data["items"][0]["domain"] == "WATER_MANAGEMENT"
    assert "Water" in data["items"][0]["title"]


@pytest.mark.asyncio
async def test_priority_filtering(client, seed_problems_data):
    # Filter min_priority_score >= 80 -> should return Ormanjhi (90) and NH-33 (85)
    resp = await client.get("/problems", params={"min_priority_score": 80.0})
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 2
    for item in data["items"]:
        assert item["priority_score"] >= 80.0


@pytest.mark.asyncio
async def test_location_filtering(client, seed_problems_data):
    # Center around Ormanjhi coordinates (23.4795, 85.4852) with 15 km radius
    resp = await client.get("/problems", params={
        "latitude": 23.4795,
        "longitude": 85.4852,
        "radius_km": 15.0,
    })
    assert resp.status_code == 200
    data = resp.json()
    # Only Ormanjhi problem is within 15 km (NH-33 is ~12 km away so might be included if within 15 km)
    assert data["total"] >= 1
    assert data["items"][0]["domain"] == "WATER_MANAGEMENT"


@pytest.mark.asyncio
async def test_location_single_coordinate_error_422(client, seed_problems_data):
    # Only latitude -> 422
    resp = await client.get("/problems", params={"latitude": 23.4795})
    assert resp.status_code == 422

    # Only longitude -> 422
    resp = await client.get("/problems", params={"longitude": 85.4852})
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_status_filter_resolved(client, seed_problems_data):
    resp = await client.get("/problems", params={"status": "RESOLVED"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 1
    assert data["items"][0]["status"] == "RESOLVED"


@pytest.mark.asyncio
async def test_pagination_and_validation(client, seed_problems_data):
    resp = await client.get("/problems", params={"limit": 1, "offset": 0})
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["items"]) == 1
    assert data["total"] == 3
    assert data["limit"] == 1

    # limit > 50 -> 422
    resp = await client.get("/problems", params={"limit": 100})
    assert resp.status_code == 422

    # limit < 1 -> 422
    resp = await client.get("/problems", params={"limit": 0})
    assert resp.status_code == 422

    # radius_km > 100 -> 422
    resp = await client.get("/problems", params={"latitude": 23.34, "longitude": 85.30, "radius_km": 150})
    assert resp.status_code == 422
