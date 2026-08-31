"""
schemas.py
==========
Pydantic data models (schemas) for the JSIE Societal Innovation Portal AI service.
All models are fully annotated and carry field-level validation constraints.

Language support: English, Devanagari Hindi, and Hinglish (mixed) text.
"""

from __future__ import annotations

from typing import List, Optional
from pydantic import BaseModel, Field, field_validator


# ---------------------------------------------------------------------------
# Candidate Report
# ---------------------------------------------------------------------------

class CandidateReport(BaseModel):
    """
    Represents a single previously-filed report retrieved from the
    external database and passed into the API payload for duplicate
    detection. The backend never persists any data -- all state lives
    in the caller's database.
    """

    id: str = Field(
        ...,
        description="Unique identifier of the candidate report (supplied by the caller's DB).",
        min_length=1,
    )
    title: str = Field(
        ...,
        description="Title of the candidate report (English / Hindi / Hinglish).",
        min_length=1,
        max_length=300,
    )
    description: str = Field(
        ...,
        description="Body text of the candidate report.",
        min_length=1,
        max_length=5000,
    )
    lat: float = Field(..., description="Latitude of the candidate report location.", ge=-90.0, le=90.0)
    lng: float = Field(..., description="Longitude of the candidate report location.", ge=-180.0, le=180.0)


# ---------------------------------------------------------------------------
# Check Report -- Request / Response
# ---------------------------------------------------------------------------

class CheckReportRequest(BaseModel):
    """
    Payload sent by the frontend to validate a new citizen report before
    it is persisted. Contains the new submission + a batch of candidate
    reports for duplicate comparison.
    """

    title: str = Field(
        ...,
        description="Title of the new report being submitted.",
        min_length=2,
        max_length=300,
    )
    description: str = Field(
        ...,
        description="Detailed description of the reported issue.",
        min_length=5,
        max_length=5000,
    )
    domain: str = Field(
        ...,
        description=(
            "Problem domain selected by the citizen. "
            "Must be one of the 11 supported domains."
        ),
        min_length=2,
        max_length=100,
    )
    lat: float = Field(..., description="Latitude of the new report's location.", ge=-90.0, le=90.0)
    lng: float = Field(..., description="Longitude of the new report's location.", ge=-180.0, le=180.0)
    candidate_reports: List[CandidateReport] = Field(
        default_factory=list,
        description="Up to 50 previously-filed reports passed from the caller's database.",
    )

    @field_validator("candidate_reports")
    @classmethod
    def validate_candidates_length(cls, v: List[CandidateReport]) -> List[CandidateReport]:
        """Enforce the hard limit of 50 candidate reports per request."""
        if len(v) > 50:
            raise ValueError("candidate_reports must contain at most 50 entries.")
        return v


class CheckReportResponse(BaseModel):
    """
    Response returned after quality-checking and duplicate-detection.
    Includes human-readable explanations and explicit user messages for UI display.
    """

    quality_status: str = Field(
        ...,
        description=(
            "'NORMAL' if the submission passes all quality gates; "
            "'REVIEW_PENDING' if at least one gate fails."
        ),
    )
    quality_reasons: List[str] = Field(
        default_factory=list,
        description=(
            "List of gate identifiers that caused a REVIEW_PENDING status. "
            "Empty when quality_status is NORMAL."
        ),
    )
    user_message: str = Field(
        default="Report successfully passed quality validation.",
        description=(
            "Explicit user-facing explanation statement explaining gate errors, "
            "profanity warnings, or duplicate submission statuses."
        ),
    )
    duplicate_status: str = Field(
        ...,
        description=(
            "'STRONG_MATCH'   -- cosine similarity >= 0.82 with a nearby report; "
            "'PROBABLE_MATCH' -- similarity in [0.70, 0.81]; "
            "'NEW_ISSUE'      -- no close duplicate found."
        ),
    )
    similarity_score: float = Field(
        ...,
        description=(
            "Highest cosine similarity score against any candidate report. "
            "Returns 0.0 when duplicate_status is NEW_ISSUE."
        ),
        ge=0.0,
        le=1.0,
    )
    matched_report_id: Optional[str] = Field(
        default=None,
        description="ID of the closest duplicate candidate; None when NEW_ISSUE.",
    )


# ---------------------------------------------------------------------------
# Generate Statement -- Request / Response
# ---------------------------------------------------------------------------

class GenerateStatementRequest(BaseModel):
    """
    Aggregates one or more raw citizen complaint texts so the AI can synthesize
    a single professional problem statement for engineering review.
    """

    raw_descriptions: List[str] = Field(
        ...,
        description="List of raw citizen complaint strings (English / Hindi / Hinglish).",
    )

    @field_validator("raw_descriptions")
    @classmethod
    def validate_descriptions(cls, v: List[str]) -> List[str]:
        """Strip blank entries, reject empty lists, and cap at 20 items."""
        cleaned = [d.strip() for d in v if d.strip()]
        if not cleaned:
            raise ValueError("raw_descriptions must contain at least one non-empty string.")
        if len(cleaned) > 20:
            raise ValueError("raw_descriptions must contain at most 20 entries.")
        return cleaned


class GenerateStatementResponse(BaseModel):
    """
    Structured, professional problem statement generated from raw citizen inputs.
    """

    standardized_statement: str = Field(
        ...,
        description=(
            "A structured engineering problem statement with two sections: "
            "'1. Problem Definition' and '2. Technical Challenges'."
        ),
    )


# ---------------------------------------------------------------------------
# Monthly Root-Cause Clustering -- Request / Response
# ---------------------------------------------------------------------------

class ClusterItem(BaseModel):
    """
    Single report item submitted in batch for periodic root-cause clustering.
    """
    id: str = Field(..., description="Report ID")
    title: str = Field(..., description="Report Title")
    description: str = Field(..., description="Report Description")
    domain: str = Field(..., description="Problem Domain")
    region_name: str = Field(
        default="General Region",
        description="Name of town, village, or urban sector (e.g. 'Village Ormanjhi', 'Urban Sector 4')",
    )
    region_type: str = Field(
        default="RURAL",
        description="Region type: 'RURAL' or 'URBAN'",
    )
    lat: float = Field(default=23.3441, ge=-90.0, le=90.0)
    lng: float = Field(default=85.3096, ge=-180.0, le=180.0)


class ClusterGroup(BaseModel):
    """
    Represents a cluster of reports sharing the same underlying root cause.
    """
    cluster_id: str = Field(..., description="Unique Cluster ID")
    root_cause_summary: str = Field(..., description="Identified common technical root cause summary")
    affected_regions: List[str] = Field(..., description="List of distinct rural & urban regions affected")
    report_ids: List[str] = Field(..., description="List of report IDs belonging to this root cause cluster")
    is_cross_regional: bool = Field(
        ...,
        description="True if cluster bridges both Rural and Urban reports sharing the same root cause",
    )
    recommended_solution_category: str = Field(
        ...,
        description="Transferable R&D / Engineering solution category (e.g. 'Bio-Filtration & Heavy Metal Treatment')",
    )


class ClusterReportsRequest(BaseModel):
    """
    Request payload for periodic monthly root-cause clustering.
    """
    reports: List[ClusterItem] = Field(
        ...,
        description="Batch of reports to analyze for common root causes.",
        min_length=2,
        max_length=500,
    )


class ClusterReportsResponse(BaseModel):
    """
    Response containing root-cause clusters linking rural and urban issues.
    """
    total_reports_analyzed: int
    total_clusters_found: int
    cross_regional_clusters: int
    clusters: List[ClusterGroup]
