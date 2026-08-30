import pytest
from sqlalchemy import select
from app.models.raw_report import RawReport
from app.services.ai_service import AIService


@pytest.mark.asyncio
async def test_citizen_report_submission_success(client, seed_users, db_session):
    # 1. Login as CITIZEN
    login_resp = await client.post("/auth/token", json={
        "email": "citizen@test.local",
        "password": "DevPassword123!",
    })
    assert login_resp.status_code == 200
    token = login_resp.json()["access_token"]

    # 2. Submit valid report
    payload = {
        "description": "There is no clean drinking water in our village for the last five days.",
        "domain": "WATER_MANAGEMENT",
        "latitude": 23.3441,
        "longitude": 85.3096,
        "title": "Drinking water shortage in ward 3",
        "photo_url": "https://example.com/photos/water.jpg",
    }
    resp = await client.post(
        "/reports",
        json=payload,
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 201
    data = resp.json()
    assert "report_id" in data
    assert data["status"] == "RECEIVED"
    assert data["processing_status"] == "STUB"
    assert "received" in data["message"].lower()

    # 3. Verify report in database and original description preserved
    stmt = select(RawReport).where(RawReport.description == payload["description"])
    result = await db_session.execute(stmt)
    report = result.scalars().first()
    assert report is not None
    assert report.title == "Drinking water shortage in ward 3"
    assert report.domain == "WATER_MANAGEMENT"
    assert report.latitude == 23.3441
    assert report.longitude == 85.3096
    assert report.photo_url == "https://example.com/photos/water.jpg"


@pytest.mark.asyncio
async def test_report_fallback_title_generation(client, seed_users, db_session):
    login_resp = await client.post("/auth/token", json={
        "email": "citizen@test.local",
        "password": "DevPassword123!",
    })
    token = login_resp.json()["access_token"]

    # Submit without title
    payload = {
        "description": "Major road crater near the primary school is causing daily accidents.",
        "domain": "ROADS_INFRASTRUCTURE",
        "latitude": 23.4000,
        "longitude": 85.3500,
    }
    resp = await client.post(
        "/reports",
        json=payload,
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 201

    stmt = select(RawReport).where(RawReport.description == payload["description"])
    result = await db_session.execute(stmt)
    report = result.scalars().first()
    assert report is not None
    assert len(report.title) > 0
    assert "Major road crater" in report.title


@pytest.mark.asyncio
async def test_report_unauthenticated_returns_401(client):
    resp = await client.post("/reports", json={
        "description": "Valid description exceeding twenty characters limit.",
        "domain": "WATER_MANAGEMENT",
        "latitude": 23.34,
        "longitude": 85.30,
    })
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_report_non_citizen_roles_return_403(client, seed_users):
    non_citizen_accounts = [
        "student@test.local",
        "university@test.local",
        "industry@test.local",
        "government@test.local",
    ]
    for email in non_citizen_accounts:
        login_resp = await client.post("/auth/token", json={
            "email": email,
            "password": "DevPassword123!",
        })
        token = login_resp.json()["access_token"]

        resp = await client.post(
            "/reports",
            json={
                "description": "Valid description exceeding twenty characters limit.",
                "domain": "WATER_MANAGEMENT",
                "latitude": 23.34,
                "longitude": 85.30,
            },
            headers={"Authorization": f"Bearer {token}"},
        )
        assert resp.status_code == 403, f"Expected 403 for {email}"


@pytest.mark.asyncio
async def test_report_validation_errors(client, seed_users):
    login_resp = await client.post("/auth/token", json={
        "email": "citizen@test.local",
        "password": "DevPassword123!",
    })
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Short description (< 20 chars) -> 422
    resp = await client.post("/reports", json={
        "description": "Too short",
        "domain": "WATER_MANAGEMENT",
        "latitude": 23.34,
        "longitude": 85.30,
    }, headers=headers)
    assert resp.status_code == 422

    # Empty description after trimming -> 422
    resp = await client.post("/reports", json={
        "description": "                    ",
        "domain": "WATER_MANAGEMENT",
        "latitude": 23.34,
        "longitude": 85.30,
    }, headers=headers)
    assert resp.status_code == 422

    # Invalid domain -> 422
    resp = await client.post("/reports", json={
        "description": "Valid description exceeding twenty characters limit.",
        "domain": "INVALID_UNKNOWN_DOMAIN",
        "latitude": 23.34,
        "longitude": 85.30,
    }, headers=headers)
    assert resp.status_code == 422

    # Latitude out of bounds -> 422
    resp = await client.post("/reports", json={
        "description": "Valid description exceeding twenty characters limit.",
        "domain": "WATER_MANAGEMENT",
        "latitude": 95.0,
        "longitude": 85.30,
    }, headers=headers)
    assert resp.status_code == 422

    # Longitude out of bounds -> 422
    resp = await client.post("/reports", json={
        "description": "Valid description exceeding twenty characters limit.",
        "domain": "WATER_MANAGEMENT",
        "latitude": 23.34,
        "longitude": 195.0,
    }, headers=headers)
    assert resp.status_code == 422

    # Invalid photo URL -> 422
    resp = await client.post("/reports", json={
        "description": "Valid description exceeding twenty characters limit.",
        "domain": "WATER_MANAGEMENT",
        "latitude": 23.34,
        "longitude": 85.30,
        "photo_url": "ftp://not-a-valid-http-url",
    }, headers=headers)
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_ai_stub_failure_retains_report(client, seed_users, db_session, monkeypatch):
    login_resp = await client.post("/auth/token", json={
        "email": "citizen@test.local",
        "password": "DevPassword123!",
    })
    token = login_resp.json()["access_token"]

    # Mock AIService.process_report to simulate an unhandled failure
    async def mock_fail_process(*args, **kwargs):
        raise RuntimeError("Simulated AI cluster service timeout/failure.")

    monkeypatch.setattr(AIService, "process_report", mock_fail_process)

    payload = {
        "description": "Pipeline failure test description with more than twenty characters.",
        "domain": "WATER_MANAGEMENT",
        "latitude": 23.34,
        "longitude": 85.30,
    }
    resp = await client.post(
        "/reports",
        json=payload,
        headers={"Authorization": f"Bearer {token}"},
    )
    # The submission still acknowledges success to the citizen
    assert resp.status_code == 201
    data = resp.json()
    assert data["processing_status"] == "FAILED"

    # Crucial: RawReport remains securely saved in database
    stmt = select(RawReport).where(RawReport.description == payload["description"])
    result = await db_session.execute(stmt)
    report = result.scalars().first()
    assert report is not None
