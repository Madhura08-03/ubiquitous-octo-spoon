"""
app.py
======
FastAPI application entry point for the JSIE Societal Innovation Portal AI Service.

This module wires together all domain modules into a clean, stateless REST API:

Endpoints
---------
GET  /health                  -- Service liveness probe (used by load balancers / k8s).
POST /ai/check-report         -- Quality check + duplicate detection for a new report.
POST /ai/generate-statement   -- AI-powered bilingual problem statement generation.

Stateless design
----------------
The service is 100% database-free. All report data is passed directly in the
request payload (via 'candidate_reports'). The ONLY in-process mutable state
is the rolling_cache (a set of SHA-256 hashes for Gate 4 anti-spam detection),
which is managed via a background TTL-eviction task. This cache is intentionally
process-local; it does not survive restarts, which is acceptable for the
anti-abuse use case (a restart flushes the window).

Configuration
-------------
Set the following environment variables before starting the service:
  GEMINI_API_KEY    -- Google Gemini API key (for /ai/generate-statement)
  SPAM_WINDOW_SECS  -- Rolling cache eviction interval in seconds (default: 900)
  PORT              -- Port to listen on when running directly (default: 8000)

Run
---
  uvicorn app:app --host 0.0.0.0 --port 8000 --reload
"""

from __future__ import annotations

import asyncio
import logging
import os
import time
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from generator import generate_standardized_statement
from quality import evaluate_submission_quality
from schemas import (
    CheckReportRequest,
    CheckReportResponse,
    GenerateStatementRequest,
    GenerateStatementResponse,
    ClusterReportsRequest,
    ClusterReportsResponse,
)
from similarity import detect_duplicates

# ---------------------------------------------------------------------------
# Logging configuration
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%S",
)
logger: logging.Logger = logging.getLogger("jsie_ai_service")

# ---------------------------------------------------------------------------
# Rolling cache for Gate 4 (anti-spam SHA-256 hash store)
# ---------------------------------------------------------------------------
# Structure: { sha256_hex_digest: unix_timestamp_of_insertion }
# This dict is kept in process memory.  A background task periodically
# evicts entries older than SPAM_WINDOW_SECS.
_rolling_cache: dict[str, float] = {}

# Interval (seconds) for the rolling cache TTL eviction task.
SPAM_WINDOW_SECS: int = int(os.environ.get("SPAM_WINDOW_SECS", 900))   # 15 minutes


def _rolling_cache_as_set() -> set[str]:
    """
    Return the current active hash keys as a plain set, to be used by
    quality.evaluate_submission_quality which expects set[str].

    New hashes added by the quality module are intercepted via a proxy set
    wrapper in the endpoint handler and written back to the TTL dict.
    """
    return set(_rolling_cache.keys())


# ---------------------------------------------------------------------------
# Background TTL eviction task
# ---------------------------------------------------------------------------

async def _evict_expired_cache_entries() -> None:
    """
    Background coroutine that runs forever and removes hash entries from
    _rolling_cache that are older than SPAM_WINDOW_SECS.

    Runs every 60 seconds to minimise overhead while keeping the window
    tight enough for practical abuse prevention.
    """
    while True:
        await asyncio.sleep(60)   # Check every minute.
        now: float = time.time()
        expired_keys: list[str] = [
            k for k, ts in _rolling_cache.items()
            if now - ts > SPAM_WINDOW_SECS
        ]
        for key in expired_keys:
            _rolling_cache.pop(key, None)

        if expired_keys:
            logger.info("Rolling cache: evicted %d expired hash(es).", len(expired_keys))


# ---------------------------------------------------------------------------
# Application lifespan (startup / shutdown)
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    FastAPI lifespan context manager.

    Startup:  Launch the rolling-cache eviction background task.
    Shutdown: The task is cancelled automatically when the event loop closes.
    """
    logger.info("JSIE AI Service starting up.")
    eviction_task = asyncio.create_task(_evict_expired_cache_entries())
    logger.info(
        "Rolling cache eviction task started (window=%ds).", SPAM_WINDOW_SECS
    )

    yield   # Application runs here.

    # Graceful shutdown.
    eviction_task.cancel()
    try:
        await eviction_task
    except asyncio.CancelledError:
        pass
    logger.info("JSIE AI Service shutting down.")


# ---------------------------------------------------------------------------
# FastAPI application
# ---------------------------------------------------------------------------

app: FastAPI = FastAPI(
    title="JSIE Societal Innovation Portal — AI Service",
    description=(
        "Stateless microservice providing multi-gate quality validation "
        "and spatio-textual duplicate detection for citizen-filed reports, "
        "plus bilingual (Hindi/English) AI-powered problem statement generation."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# ---------------------------------------------------------------------------
# CORS middleware (configure origins for your deployment)
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Global exception handler
# ---------------------------------------------------------------------------

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Catch-all exception handler.  Returns a clean JSON error response
    instead of leaking stack traces to the client.
    """
    logger.exception("Unhandled exception on %s %s", request.method, request.url.path)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred. Please try again later."},
    )


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@app.get(
    "/health",
    summary="Health Check",
    description="Returns a 200 OK response to confirm the service is alive.",
    tags=["Monitoring"],
)
async def health_check() -> dict[str, str]:
    """
    Liveness probe used by load balancers, Kubernetes, and monitoring tools.

    Returns
    -------
    dict
        {"status": "ok", "service": "JSIE AI Service"}
    """
    return {
        "status": "ok",
        "service": "JSIE AI Service",
        "version": app.version,
    }


@app.post(
    "/ai/check-report",
    response_model=CheckReportResponse,
    summary="Quality Check & Duplicate Detection",
    description=(
        "Validates a new citizen report through the 5-gate linguistic quality "
        "pipeline (Profanity, Entropy, Compression, Phonotactics, Anti-Flooding Hash) "
        "and performs spatio-textual duplicate detection against candidate reports."
    ),
    tags=["AI Analysis"],
    status_code=status.HTTP_200_OK,
)
async def check_report(payload: CheckReportRequest) -> CheckReportResponse:
    """
    Full report validation pipeline.
    """
    logger.info(
        "check-report | domain=%r | candidates=%d",
        payload.domain,
        len(payload.candidate_reports),
    )

    proxy_cache: _CacheProxy = _CacheProxy(_rolling_cache)

    quality_status, quality_reasons, user_message = evaluate_submission_quality(
        title=payload.title,
        description=payload.description,
        rolling_cache=proxy_cache,   # type: ignore[arg-type]
    )

    duplicate_status, similarity_score, matched_report_id = detect_duplicates(payload)

    logger.info(
        "check-report result | quality=%s | duplicate=%s | score=%.4f",
        quality_status,
        duplicate_status,
        similarity_score,
    )

    return CheckReportResponse(
        quality_status=quality_status,
        quality_reasons=quality_reasons,
        user_message=user_message,
        duplicate_status=duplicate_status,
        similarity_score=similarity_score,
        matched_report_id=matched_report_id,
    )


@app.post(
    "/ai/cluster-reports",
    response_model=ClusterReportsResponse,
    summary="Monthly Root-Cause Clustering Engine",
    description=(
        "Periodically clusters reports across distinct geographic regions "
        "(e.g., Rural Villages vs Urban Municipalities) sharing identical root causes, "
        "enabling transferable engineering R&D solutions across sectors."
    ),
    tags=["AI Analysis"],
    status_code=status.HTTP_200_OK,
)
async def cluster_reports(payload: ClusterReportsRequest) -> ClusterReportsResponse:
    """
    Periodic Root-Cause Clustering Endpoint.
    """
    logger.info("cluster-reports | analyzing %d batch reports", len(payload.reports))
    return perform_monthly_root_cause_clustering(payload)


@app.post(
    "/ai/generate-statement",
    response_model=GenerateStatementResponse,
    summary="Bilingual Problem Statement Generation",
    description=(
        "Aggregates raw citizen complaint texts (English / Hindi / Hinglish) "
        "into a single structured engineering problem statement using the "
        "Google Gemini 2.5 Flash model, with a local fallback summarizer."
    ),
    tags=["AI Analysis"],
    status_code=status.HTTP_200_OK,
)
async def generate_statement(
    payload: GenerateStatementRequest,
) -> GenerateStatementResponse:
    """
    Bilingual statement generation pipeline:

    1. Primary: Calls Google Gemini 2.5 Flash API with a structured system
       prompt to produce a 2-section engineering problem statement.
    2. Fallback: If the API is unavailable, uses a local algorithmic
       summarizer to produce a comparable (though simpler) output.

    Parameters
    ----------
    payload : GenerateStatementRequest
        List of raw citizen complaint strings.

    Returns
    -------
    GenerateStatementResponse
        Structured problem statement with 'Problem Definition' and
        'Technical Challenges' sections.
    """
    logger.info(
        "generate-statement | input_count=%d", len(payload.raw_descriptions)
    )

    # Run the generation in a thread pool to avoid blocking the event loop
    # (the Gemini SDK uses synchronous HTTP under the hood).
    loop = asyncio.get_event_loop()
    statement: str = await loop.run_in_executor(
        None,
        generate_standardized_statement,
        payload.raw_descriptions,
    )

    logger.info("generate-statement | output_length=%d chars", len(statement))

    return GenerateStatementResponse(standardized_statement=statement)


# ---------------------------------------------------------------------------
# Cache proxy helper
# ---------------------------------------------------------------------------

class _CacheProxy:
    """
    A minimal set-like proxy that wraps _rolling_cache (dict[str, float])
    so that it can be passed to quality.evaluate_submission_quality which
    expects a plain set[str].

    Supports the operations used by the quality module:
      - `key in proxy`   -> membership test
      - `proxy.add(key)` -> add with current timestamp
    """

    def __init__(self, ttl_store: dict[str, float]) -> None:
        self._store: dict[str, float] = ttl_store

    def __contains__(self, item: object) -> bool:
        return item in self._store

    def add(self, item: str) -> None:
        """Add a new hash to the store with the current timestamp."""
        self._store[item] = time.time()

    def __len__(self) -> int:
        return len(self._store)


# ---------------------------------------------------------------------------
# Direct run entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn

    port: int = int(os.environ.get("PORT", 8000))
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=port,
        reload=False,
        log_level="info",
    )
