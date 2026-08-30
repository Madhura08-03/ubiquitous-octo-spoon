import pytest

roles_test_data = [
    ("citizen@test.local", "/auth/test/citizen"),
    ("student@test.local", "/auth/test/student"),
    ("university@test.local", "/auth/test/university"),
    ("industry@test.local", "/auth/test/industry"),
    ("government@test.local", "/auth/test/government"),
]


@pytest.mark.asyncio
async def test_authorized_role_access(client, seed_users):
    for email, endpoint in roles_test_data:
        login_resp = await client.post("/auth/token", json={
            "email": email,
            "password": "DevPassword123!",
        })
        token = login_resp.json()["access_token"]

        resp = await client.get(
            endpoint,
            headers={"Authorization": f"Bearer {token}"},
        )
        assert resp.status_code == 200, f"Failed for {email} at {endpoint}"
        assert "Access granted" in resp.json()["message"]


@pytest.mark.asyncio
async def test_forbidden_role_access(client, seed_users):
    login_resp = await client.post("/auth/token", json={
        "email": "citizen@test.local",
        "password": "DevPassword123!",
    })
    token = login_resp.json()["access_token"]

    # Citizen accessing Government endpoint -> 403 Forbidden
    resp = await client.get(
        "/auth/test/government",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 403
    assert resp.json()["error"]["code"] == "FORBIDDEN"

    # Citizen accessing Student endpoint -> 403 Forbidden
    resp = await client.get(
        "/auth/test/student",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 403
    assert resp.json()["error"]["code"] == "FORBIDDEN"
