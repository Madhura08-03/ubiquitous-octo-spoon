# AI Processing Service Contract (Person C Integration Specification)

This document formalizes the internal interface between the Core Backend (Person A) and the AI Ingestion & Clustering Pipeline (Person C).

---

## 🎯 Architecture & Guiding Principles

1. **Decoupled Architecture**: The backend saves and commits every valid `RawReport` to PostgreSQL/SQLite *before* invoking the AI contract.
2. **Authoritative Domain**: The citizen-selected domain is strictly authoritative. The AI engine must **never** overwrite or alter the citizen's chosen domain.
3. **Graceful Degradation**: If the AI service fails or times out, the raw report remains safely stored in the database with status `RECEIVED` / `UNDER_REVIEW`. No citizen submission is ever lost or rolled back due to AI downtime.
4. **Current Status**: The backend provides a deterministic Python stub in `backend/app/services/ai_service.py` returning `processing_status="STUB"`.

---

## 📥 Ingestion Contract (Input)

When `ReportService.create_report()` is invoked by a citizen, the backend calls `AIService.process_report()` with the following parameters:

```python
async def process_report(
    report_id: uuid.UUID,
    description: str,
    domain: ProblemDomain | str,
    latitude: Optional[float],
    longitude: Optional[float],
) -> Dict[str, Any]:
```

### Input Field Specifications
| Field | Type | Description |
| :--- | :--- | :--- |
| `report_id` | `uuid.UUID` | Unique identifier of the persisted `raw_reports` record. |
| `description` | `str` | Original citizen description (min 20, max 3000 chars). |
| `domain` | `str` | Canonical domain chosen by the citizen (e.g. `WATER_MANAGEMENT`). |
| `latitude` | `float \| None` | Geographic latitude (-90.0 to +90.0). |
| `longitude` | `float \| None` | Geographic longitude (-180.0 to +180.0). |

---

## 📤 Output Contract (Expected Return Value)

The AI module must return a dictionary conforming to the following structure:

```json
{
  "processing_status": "PROCESSED",
  "cluster_action": "MATCHED_CLUSTER",
  "cluster_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "similarity_score": 0.88,
  "standardized_problem": {
    "title": "Severe Potable Water Deficit in Ormanjhi Block",
    "problem_summary": "Aggregated civic reports reveal four villages facing severe groundwater contamination and non-operational borewells.",
    "affected_community": "Ormanjhi Block (approx. 3,500 residents)",
    "observed_impact": "High incidence of gastrointestinal illness and severe daily collection burden."
  },
  "priority_score": 92.0
}
```

### Output Field Definitions
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `processing_status` | `str` | Yes | `"PROCESSED"`, `"NEW_CLUSTER"`, `"STUB"`, or `"FAILED"`. |
| `cluster_action` | `str` | Yes | `"MATCHED_CLUSTER"` (joined existing) or `"NEW_CLUSTER"` (created new cluster). |
| `cluster_id` | `UUID \| str \| None` | Optional | Target `standardized_problems.id` if matched. |
| `similarity_score` | `float \| None` | Optional | Cosine / semantic similarity confidence (0.0 to 1.0). |
| `standardized_problem` | `dict \| None` | Optional | Generated summary dict if a new cluster was spawned. |
| `priority_score` | `float \| None` | Optional | Calculated priority index (0.0 to 100.0). |

---

## ⚠️ Error Handling & Fault Tolerance

```
[Citizen POST /reports]
       ↓
[Persist RawReport to DB] (COMMITTED)
       ↓
[Invoke AIService.process_report()]
       ├─► Success: Log cluster match / update processing status
       └─► Exception: Log error, retain RawReport with status RECEIVED
```

- **Timeout Policy**: External AI inferences should complete within 3000ms.
- **Exceptions**: Any uncaught exception within the AI pipeline will be caught by `ReportService`, logging the stack trace without aborting the citizen's HTTP 201 Created acknowledgment.
