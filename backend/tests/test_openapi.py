import pytest


@pytest.mark.asyncio
async def test_openapi_schema_contains_required_endpoints(client):
    resp = await client.get("/openapi.json")
    assert resp.status_code == 200
    schema = resp.json()

    paths = schema.get("paths", {})
    assert "/health" in paths
    assert "/auth/token" in paths
    assert "/reports" in paths
    assert "/problems" in paths
    assert "/teams" in paths
    assert "/teams/{team_id}/members" in paths
    assert "/solutions/{solution_id}/industry-review" in paths
    assert "/rankings/universities" in paths
    assert "/rankings/industry" in paths
    assert "/public/problems" in paths
    assert "/public/analytics" in paths

    # Verify POST /teams
    assert "post" in paths["/teams"]

    # Verify GET /public/analytics
    assert "get" in paths["/public/analytics"]

    # Verify GET /rankings/universities
    assert "get" in paths["/rankings/universities"]


@pytest.mark.asyncio
async def test_docs_page_accessible(client):
    resp = await client.get("/docs")
    assert resp.status_code == 200
