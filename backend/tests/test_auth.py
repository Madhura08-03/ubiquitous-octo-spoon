import pytest

@pytest.mark.asyncio
async def test_login_success(client, seed_users):
    response = await client.post("/auth/token", json={
        "email": "citizen@test.local",
        "password": "DevPassword123!",
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_login_invalid_password(client, seed_users):
    response = await client.post("/auth/token", json={
        "email": "citizen@test.local",
        "password": "WrongPassword123!",
    })
    assert response.status_code == 401
    data = response.json()
    assert "error" in data
    assert data["error"]["code"] == "UNAUTHENTICATED"


@pytest.mark.asyncio
async def test_login_nonexistent_user(client, seed_users):
    response = await client.post("/auth/token", json={
        "email": "unknown@test.local",
        "password": "DevPassword123!",
    })
    assert response.status_code == 401
    data = response.json()
    assert "error" in data
    assert data["error"]["code"] == "UNAUTHENTICATED"


@pytest.mark.asyncio
async def test_get_me_endpoint(client, seed_users):
    login_resp = await client.post("/auth/token", json={
        "email": "student@test.local",
        "password": "DevPassword123!",
    })
    token = login_resp.json()["access_token"]

    me_resp = await client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_resp.status_code == 200
    data = me_resp.json()
    assert data["email"] == "student@test.local"
    assert data["role"] == "STUDENT"
    assert data["is_active"] is True
