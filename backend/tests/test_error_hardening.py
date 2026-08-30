import pytest
import uuid


@pytest.mark.asyncio
async def test_unauthenticated_requests_return_401(client):
    # Protected endpoints without token
    assert (await client.get("/auth/me")).status_code == 401
    assert (await client.post("/reports", json={})).status_code == 401
    assert (await client.post("/teams", json={})).status_code == 401
    assert (await client.post(f"/teams/{uuid.uuid4()}/members", json={})).status_code == 401
    assert (await client.post(f"/solutions/{uuid.uuid4()}/industry-review", json={})).status_code == 401


@pytest.mark.asyncio
async def test_malformed_and_expired_jwt_return_401(client):
    headers_malformed = {"Authorization": "Bearer not.a.valid.jwt"}
    assert (await client.get("/auth/me", headers=headers_malformed)).status_code == 401

    headers_prefix = {"Authorization": "Basic something"}
    assert (await client.get("/auth/me", headers=headers_prefix)).status_code == 401


@pytest.mark.asyncio
async def test_invalid_uuid_paths_return_422(client, seed_users):
    login_uni = await client.post("/auth/token", json={
        "email": "university@test.local",
        "password": "DevPassword123!",
    })
    token_uni = login_uni.json()["access_token"]

    resp = await client.post(
        "/teams/not-a-valid-uuid/members",
        json={"student_id": str(uuid.uuid4())},
        headers={"Authorization": f"Bearer {token_uni}"},
    )
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_nonexistent_resource_returns_404(client, seed_users):
    login_uni = await client.post("/auth/token", json={
        "email": "university@test.local",
        "password": "DevPassword123!",
    })
    token_uni = login_uni.json()["access_token"]

    # Nonexistent problem
    resp_prob = await client.post(
        "/teams",
        json={"problem_id": str(uuid.uuid4()), "name": "Nonexistent Problem Team"},
        headers={"Authorization": f"Bearer {token_uni}"},
    )
    assert resp_prob.status_code == 404

    # Nonexistent team
    resp_team = await client.post(
        f"/teams/{uuid.uuid4()}/members",
        json={"student_id": str(uuid.uuid4())},
        headers={"Authorization": f"Bearer {token_uni}"},
    )
    assert resp_team.status_code == 404


@pytest.mark.asyncio
async def test_malformed_json_returns_422(client, seed_users):
    login_cit = await client.post("/auth/token", json={
        "email": "citizen@test.local",
        "password": "DevPassword123!",
    })
    token_cit = login_cit.json()["access_token"]

    # Missing required field 'description' and 'domain'
    resp = await client.post(
        "/reports",
        json={"title": "Missing mandatory fields"},
        headers={"Authorization": f"Bearer {token_cit}"},
    )
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_invalid_enum_returns_422(client, seed_users):
    login_cit = await client.post("/auth/token", json={
        "email": "citizen@test.local",
        "password": "DevPassword123!",
    })
    token_cit = login_cit.json()["access_token"]

    resp = await client.post(
        "/reports",
        json={
            "description": "Valid description with invalid domain name.",
            "domain": "INVALID_NONEXISTENT_DOMAIN",
            "latitude": 23.34,
            "longitude": 85.30,
        },
        headers={"Authorization": f"Bearer {token_cit}"},
    )
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_negative_pagination_params_return_422(client):
    assert (await client.get("/public/problems?limit=-5")).status_code == 422
    assert (await client.get("/public/problems?limit=100")).status_code == 422
    assert (await client.get("/public/problems?offset=-1")).status_code == 422
    assert (await client.get("/rankings/universities?limit=0")).status_code == 422
