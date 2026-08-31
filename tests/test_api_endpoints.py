"""
tests/test_api_endpoints.py
===========================
Integration tests for FastAPI endpoints using the TestClient.

Tests verify:
  - GET /health returns 200 with correct body
  - POST /ai/check-report schema validation (400 on bad input)
  - POST /ai/check-report with clean input returns CheckReportResponse shape
  - POST /ai/check-report with too many candidates returns 422
  - POST /ai/generate-statement with valid input returns GenerateStatementResponse
  - POST /ai/generate-statement with empty list returns 422
  - POST /ai/generate-statement fallback (no API key set) returns valid output

NOTE: The generate-statement endpoint is tested WITHOUT a real Gemini API key.
The service must gracefully fall back to the local summarizer.
"""

import pytest
import sys
import os

# Remove any existing GEMINI_API_KEY to force fallback summarizer during tests.
os.environ.pop("GEMINI_API_KEY", None)

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from fastapi.testclient import TestClient
from app import app, _rolling_cache

client = TestClient(app)


@pytest.fixture(autouse=True)
def clear_rolling_cache():
    """
    Auto-use fixture: clear the rolling hash cache before AND after each test.

    This is necessary because Gate 4 (RAPID_SPAM_ABUSE) is stateful —
    it stores SHA-256 hashes of all submissions in the process-local
    rolling cache. Without clearing between tests, a test that submits
    the CLEAN_REPORT payload will poison the cache for every subsequent
    test that uses the same payload, causing spurious REVIEW_PENDING failures.

    The cache is cleared both before (setup) and after (teardown) each test
    to guarantee test isolation regardless of execution order.
    """
    _rolling_cache.clear()
    yield
    _rolling_cache.clear()


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------

class TestHealthEndpoint:
    def test_returns_200(self):
        response = client.get("/health")
        assert response.status_code == 200

    def test_returns_ok_status(self):
        response = client.get("/health")
        data = response.json()
        assert data["status"] == "ok"
        assert data["service"] == "JSIE AI Service"

    def test_returns_version(self):
        response = client.get("/health")
        assert "version" in response.json()


# ---------------------------------------------------------------------------
# /ai/check-report
# ---------------------------------------------------------------------------

CLEAN_REPORT = {
    "title": "Road Broken Near Main Market",
    "description": (
        "The road near the main market has large potholes that cause accidents. "
        "This has been reported multiple times but no action has been taken."
    ),
    "domain": "Urban Infrastructure & Roads",
    "lat": 23.3441,
    "lng": 85.3096,
    "candidate_reports": [],
}


class TestCheckReportEndpoint:
    def test_valid_request_returns_200(self):
        response = client.post("/ai/check-report", json=CLEAN_REPORT)
        assert response.status_code == 200

    def test_response_has_correct_schema(self):
        response = client.post("/ai/check-report", json=CLEAN_REPORT)
        data = response.json()
        assert "quality_status" in data
        assert "quality_reasons" in data
        assert "duplicate_status" in data
        assert "similarity_score" in data
        assert "matched_report_id" in data

    def test_quality_status_is_valid_value(self):
        response = client.post("/ai/check-report", json=CLEAN_REPORT)
        data = response.json()
        assert data["quality_status"] in ("NORMAL", "REVIEW_PENDING")

    def test_duplicate_status_is_valid_value(self):
        response = client.post("/ai/check-report", json=CLEAN_REPORT)
        data = response.json()
        assert data["duplicate_status"] in ("STRONG_MATCH", "PROBABLE_MATCH", "NEW_ISSUE")

    def test_no_candidates_returns_new_issue(self):
        response = client.post("/ai/check-report", json=CLEAN_REPORT)
        data = response.json()
        assert data["duplicate_status"] == "NEW_ISSUE"
        assert data["similarity_score"] == 0.0
        assert data["matched_report_id"] is None

    def test_similarity_score_in_range(self):
        response = client.post("/ai/check-report", json=CLEAN_REPORT)
        data = response.json()
        assert 0.0 <= data["similarity_score"] <= 1.0

    def test_clean_input_normal_quality(self):
        """A genuine civic complaint should pass quality gates."""
        response = client.post("/ai/check-report", json=CLEAN_REPORT)
        data = response.json()
        assert data["quality_status"] == "NORMAL"
        assert data["quality_reasons"] == []

    def test_spam_input_flagged(self):
        spam_report = {
            "title": "aaaa",
            "description": "a" * 200,
            "domain": "Water Management",
            "lat": 23.3441,
            "lng": 85.3096,
            "candidate_reports": [],
        }
        response = client.post("/ai/check-report", json=spam_report)
        data = response.json()
        assert data["quality_status"] == "REVIEW_PENDING"
        assert len(data["quality_reasons"]) == 1

    def test_too_many_candidates_rejected(self):
        """More than 50 candidates should trigger a 422 validation error."""
        candidates = [
            {
                "id": f"c{i}",
                "title": "Test",
                "description": "Test description",
                "lat": 23.3441,
                "lng": 85.3096,
            }
            for i in range(51)  # 51 > 50 limit
        ]
        payload = {**CLEAN_REPORT, "candidate_reports": candidates}
        response = client.post("/ai/check-report", json=payload)
        assert response.status_code == 422

    def test_missing_title_rejected(self):
        payload = {k: v for k, v in CLEAN_REPORT.items() if k != "title"}
        response = client.post("/ai/check-report", json=payload)
        assert response.status_code == 422

    def test_invalid_lat_rejected(self):
        payload = {**CLEAN_REPORT, "lat": 999.0}  # Invalid latitude
        response = client.post("/ai/check-report", json=payload)
        assert response.status_code == 422

    def test_duplicate_detection_with_near_identical_candidate(self):
        """A candidate with nearly identical text within range should score high."""
        description = (
            "The drainage pipe near bus stand has been leaking for two months. "
            "Sewage water flows onto the road causing a health hazard for residents."
        )
        payload = {
            "title": "Drainage Pipe Leaking Bus Stand",
            "description": description,
            "domain": "Sanitation & Waste Management",
            "lat": 23.3441,
            "lng": 85.3096,
            "candidate_reports": [
                {
                    "id": "existing_001",
                    "title": "Drainage Pipe Leaking Bus Stand",
                    "description": description,  # Identical
                    "lat": 23.3531,  # ~1 km away
                    "lng": 85.3096,
                }
            ],
        }
        response = client.post("/ai/check-report", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["duplicate_status"] == "STRONG_MATCH"
        assert data["matched_report_id"] == "existing_001"

    def test_hindi_input_processed_correctly(self):
        hindi_report = {
            "title": "पानी की समस्या",
            "description": (
                "हमारे मोहल्ले में पिछले तीन हफ्तों से पानी की आपूर्ति बंद है। "
                "नगर निगम से कई बार शिकायत की गई लेकिन कोई कार्रवाई नहीं हुई।"
            ),
            "domain": "Water Management",
            "lat": 23.3441,
            "lng": 85.3096,
            "candidate_reports": [],
        }
        response = client.post("/ai/check-report", json=hindi_report)
        assert response.status_code == 200
        data = response.json()
        assert data["quality_status"] in ("NORMAL", "REVIEW_PENDING")


# ---------------------------------------------------------------------------
# /ai/generate-statement
# ---------------------------------------------------------------------------

class TestGenerateStatementEndpoint:
    def test_valid_request_returns_200(self):
        payload = {
            "raw_descriptions": [
                "Road is completely broken near the school. Children are at risk.",
                "Bahut zyada problem hai road par. Koi nahi sun raha.",
            ]
        }
        response = client.post("/ai/generate-statement", json=payload)
        assert response.status_code == 200

    def test_response_has_standardized_statement(self):
        payload = {
            "raw_descriptions": [
                "Water supply is broken in our colony since last month."
            ]
        }
        response = client.post("/ai/generate-statement", json=payload)
        data = response.json()
        assert "standardized_statement" in data
        assert isinstance(data["standardized_statement"], str)
        assert len(data["standardized_statement"]) > 10

    def test_fallback_produces_two_sections(self):
        """Without a Gemini key, the fallback should produce both sections."""
        payload = {
            "raw_descriptions": [
                "The water pipe near the market is broken. Water is wasted daily.",
                "Pipe broken near main market. Supply disrupted.",
            ]
        }
        response = client.post("/ai/generate-statement", json=payload)
        data = response.json()
        statement = data["standardized_statement"]
        # The fallback contains both section markers.
        assert "Problem Definition" in statement
        assert "Technical Challenges" in statement

    def test_empty_list_rejected(self):
        payload = {"raw_descriptions": []}
        response = client.post("/ai/generate-statement", json=payload)
        assert response.status_code == 422

    def test_blank_strings_rejected(self):
        payload = {"raw_descriptions": ["   ", "\n\t", ""]}
        response = client.post("/ai/generate-statement", json=payload)
        assert response.status_code == 422

    def test_too_many_descriptions_rejected(self):
        payload = {"raw_descriptions": ["complaint text"] * 21}  # 21 > 20 limit
        response = client.post("/ai/generate-statement", json=payload)
        assert response.status_code == 422

    def test_hindi_descriptions_accepted(self):
        payload = {
            "raw_descriptions": [
                "सड़क बहुत खराब है, गड्ढे बहुत बड़े हैं।",
                "बारिश में पानी भर जाता है और निकलने का रास्ता नहीं है।",
            ]
        }
        response = client.post("/ai/generate-statement", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert len(data["standardized_statement"]) > 0

    def test_single_description_accepted(self):
        payload = {
            "raw_descriptions": [
                "The electricity pole near our house is tilted and sparking at night."
            ]
        }
        response = client.post("/ai/generate-statement", json=payload)
        assert response.status_code == 200

    def test_missing_raw_descriptions_field_rejected(self):
        response = client.post("/ai/generate-statement", json={})
        assert response.status_code == 422
