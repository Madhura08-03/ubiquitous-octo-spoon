import pytest
import uuid
from sqlalchemy import select
from app.core.security import hash_password
from app.models.points_event import PointsEvent
from app.models.user import User, UserRole


@pytest.fixture
async def setup_ranking_users_and_points(db_session):
    # 2 Universities
    uni1 = User(
        id=uuid.uuid4(),
        email="top_uni@test.local",
        full_name="Alpha Tech University",
        password_hash=hash_password("DevPassword123!"),
        role=UserRole.UNIVERSITY,
        is_verified=True,
        is_active=True,
    )
    uni2 = User(
        id=uuid.uuid4(),
        email="second_uni@test.local",
        full_name="Beta State University",
        password_hash=hash_password("DevPassword123!"),
        role=UserRole.UNIVERSITY,
        is_verified=True,
        is_active=True,
    )
    db_session.add(uni1)
    db_session.add(uni2)

    # 2 Industry partners
    ind1 = User(
        id=uuid.uuid4(),
        email="top_industry@test.local",
        full_name="Apex Global Solutions",
        password_hash=hash_password("DevPassword123!"),
        role=UserRole.INDUSTRY,
        is_verified=True,
        is_active=True,
    )
    ind2 = User(
        id=uuid.uuid4(),
        email="second_industry@test.local",
        full_name="Beacon Labs Inc",
        password_hash=hash_password("DevPassword123!"),
        role=UserRole.INDUSTRY,
        is_verified=True,
        is_active=True,
    )
    db_session.add(ind1)
    db_session.add(ind2)

    # Points for uni1: 150 pts (2 events)
    db_session.add(PointsEvent(user_id=uni1.id, points=100, reason="INDUSTRY_APPROVED"))
    db_session.add(PointsEvent(user_id=uni1.id, points=50, reason="TEAM_FORMED"))

    # Points for uni2: 50 pts (1 event)
    db_session.add(PointsEvent(user_id=uni2.id, points=50, reason="TEAM_FORMED"))

    # Points for ind1: 100 pts (2 events)
    db_session.add(PointsEvent(user_id=ind1.id, points=50, reason="INDUSTRY_REVIEW_COMPLETED"))
    db_session.add(PointsEvent(user_id=ind1.id, points=50, reason="INDUSTRY_REVIEW_COMPLETED"))

    # Points for ind2: 50 pts (1 event)
    db_session.add(PointsEvent(user_id=ind2.id, points=50, reason="INDUSTRY_REVIEW_COMPLETED"))

    await db_session.commit()


@pytest.mark.asyncio
async def test_university_rankings_order_and_zero_pii(client, setup_ranking_users_and_points):
    resp = await client.get("/rankings/universities")
    assert resp.status_code == 200
    data = resp.json()
    assert "items" in data
    assert data["total"] >= 2

    # Verify rank 1 is Alpha Tech University (150 pts)
    items = data["items"]
    assert items[0]["name"] == "Alpha Tech University"
    assert items[0]["points"] == 150
    assert items[0]["rank"] == 1
    assert items[0]["successful_milestones"] == 2

    # Verify zero PII
    for item in items:
        assert "password" not in item
        assert "email" not in item
        assert "phone" not in item


@pytest.mark.asyncio
async def test_industry_rankings_order_and_pagination(client, setup_ranking_users_and_points):
    resp = await client.get("/rankings/industry?limit=1&offset=0")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["items"]) == 1
    assert data["items"][0]["name"] == "Apex Global Solutions"
    assert data["items"][0]["points"] == 100
    assert data["items"][0]["rank"] == 1

    # Invalid pagination limit -> 422
    resp_err = await client.get("/rankings/industry?limit=100")
    assert resp_err.status_code == 422
