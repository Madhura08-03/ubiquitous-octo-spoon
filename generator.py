"""
generator.py
============
Bilingual AI Statement Generator for the JSIE Societal Innovation Portal.

Primary path: Google Gemini 2.5 Flash (free tier) via the `google-genai` SDK.
Fallback path: Local algorithmic summariser (no external API required).

The generator aggregates raw, messy citizen complaint texts (which may be
written in English, Hindi/Devanagari, or a mix) and synthesises a single
structured engineering problem statement with two sections:
  1. Problem Definition
  2. Technical Challenges

Architecture
------------
generate_standardized_statement(descriptions)
    |
    +-> _call_gemini_api(descriptions)   [primary]
    |       |
    |       +-- success --> return Gemini output
    |       |
    |       +-- failure (network error / rate limit / safety block)
    |               |
    +-> _local_fallback_summarizer(descriptions)  [fallback]
            |
            +-- returns a clean, programmatically assembled statement
"""

from __future__ import annotations

import logging
import os
from typing import List

# google-genai SDK (google-generativeai compatible import via new SDK)
try:
    from google import genai
    from google.genai import types as genai_types
    _GENAI_AVAILABLE = True
except ImportError:
    _GENAI_AVAILABLE = False

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

# The Gemini model to use for statement generation.
GEMINI_MODEL: str = os.environ.get("GEMINI_MODEL", "gemini-3.6-flash")

# System prompt engineering:
# Strict, domain-specific instructions that constrain the model's output
# to a professional engineering problem-statement format in English so that
# academic institutes (IITs/NITs/universities) and industry R&D partners can
# easily understand and act upon citizen complaints submitted in any language.
_SYSTEM_PROMPT: str = (
    "You are a senior system & civil engineer for Jharkhand State. "
    "You will receive a list of raw, messy, and repetitive citizen complaints "
    "(written in Hindi, Devanagari script, English, or mixed Hinglish). "
    "Synthesize and translate these complaints into a single, highly structured, "
    "objective, and technical Problem Statement written ENTIRELY in Professional English. "
    "This statement will be published on the Institute & Industry Portal so academic researchers "
    "and corporate R&D teams can design technical solutions.\n\n"
    "The output must contain exactly two distinct sections:\n"
    "  1. Problem Definition\n"
    "  2. Technical Challenges\n\n"
    "Ensure all specific details, location nuances, and functional impacts mentioned in the "
    "raw inputs are preserved and accurately represented in English. "
    "Avoid emotional language, exclamation marks, or political references. "
    "Use bullet points for each section. "
    "Do not include any preamble or closing remarks outside these two sections."
)

# Environment variable name for the Gemini API key.
# Set this in your deployment environment or .env file.
_GEMINI_API_KEY_ENV: str = "GEMINI_API_KEY"


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def generate_standardized_statement(descriptions: List[str]) -> str:
    """
    Aggregate raw citizen complaint texts into a single structured
    engineering problem statement.

    Tries the Gemini API first; falls back to local summarization if the
    API call fails for any reason (network error, rate limit, safety block,
    missing API key, etc.).

    Parameters
    ----------
    descriptions : List[str]
        List of raw citizen complaint strings (English / Hindi / Hinglish).
        The list should be non-empty and pre-validated by the caller.

    Returns
    -------
    str
        A structured problem statement with sections:
        '1. Problem Definition' and '2. Technical Challenges'.
    """
    if not descriptions:
        return _local_fallback_summarizer(["No input provided."])

    # Primary path: Gemini API
    try:
        if _GENAI_AVAILABLE:
            result: str = _call_gemini_api(descriptions)
            if result:
                return result
    except Exception as exc:  # noqa: BLE001
        logger.warning(
            "Gemini API call failed (%s: %s). Activating local fallback.",
            type(exc).__name__,
            exc,
        )

    # Fallback path: local algorithmic summariser
    logger.info("Using local fallback summarizer.")
    return _local_fallback_summarizer(descriptions)


# Default API key fallback if GEMINI_API_KEY environment variable is not set
DEFAULT_GEMINI_API_KEY: str = "YOUR_GEMINI_API_KEY_HERE"


def _get_active_api_key() -> str:
    """
    Resolve Gemini API Key from:
      1. Environment variable GEMINI_API_KEY
      2. .env file in project root
      3. Default fallback key
    """
    key: str = os.environ.get(_GEMINI_API_KEY_ENV, "").strip()
    if key:
        return key

    # Attempt loading from .env
    env_path: str = os.path.join(os.path.dirname(__file__), ".env")
    if os.path.exists(env_path):
        try:
            with open(env_path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, v = line.split("=", 1)
                        if k.strip() == _GEMINI_API_KEY_ENV and v.strip():
                            key = v.strip()
                            os.environ[_GEMINI_API_KEY_ENV] = key
                            return key
        except Exception:
            pass

    # Use default key fallback
    os.environ[_GEMINI_API_KEY_ENV] = DEFAULT_GEMINI_API_KEY
    return DEFAULT_GEMINI_API_KEY


# ---------------------------------------------------------------------------
# Primary: Gemini API call
# ---------------------------------------------------------------------------

def _call_gemini_api(descriptions: List[str]) -> str:
    """
    Call the Google Gemini 3.6 Flash model to generate a structured
    problem statement from the provided descriptions.

    Parameters
    ----------
    descriptions : List[str]
        Raw citizen complaint texts.

    Returns
    -------
    str
        Model-generated structured problem statement.

    Raises
    ------
    Exception
        Re-raises any exception from the Google GenAI SDK so the caller
        can activate the fallback path.
    """
    api_key: str = _get_active_api_key()
    if not api_key:
        raise ValueError(
            f"Gemini API key not set. "
            f"Please configure the {_GEMINI_API_KEY_ENV!r} environment variable."
        )

    # Initialise the Google GenAI client with the API key.
    client = genai.Client(api_key=api_key)

    import time

    # Build the user prompt by enumerating each complaint.
    numbered_complaints: str = "\n".join(
        f"{i + 1}. {desc}" for i, desc in enumerate(descriptions)
    )
    user_prompt: str = (
        f"Here are the raw citizen complaints:\n\n"
        f"{numbered_complaints}\n\n"
        "Please synthesize these into a structured engineering Problem Statement."
    )

    # Retry loop for transient Google cloud 503 high-demand spikes
    max_retries = 3
    last_exception = None

    for attempt in range(1, max_retries + 1):
        try:
            response = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=user_prompt,
                config=genai_types.GenerateContentConfig(
                    system_instruction=_SYSTEM_PROMPT,
                    temperature=0.3,          # Low temperature for factual, consistent output
                    max_output_tokens=1024,   # Sufficient for a structured 2-section statement
                    candidate_count=1,
                ),
            )

            # Extract text from response
            if hasattr(response, "text") and response.text:
                return response.text.strip()

            if (
                hasattr(response, "candidates")
                and response.candidates
                and response.candidates[0].content
                and response.candidates[0].content.parts
            ):
                parts = response.candidates[0].content.parts
                text = "".join(
                    part.text for part in parts if hasattr(part, "text") and part.text
                )
                return text.strip()

        except Exception as exc:
            last_exception = exc
            exc_str = str(exc)
            # If temporary 503 server spike or 429 rate limit, wait and retry
            if ("503" in exc_str or "UNAVAILABLE" in exc_str or "429" in exc_str) and attempt < max_retries:
                logger.info("Gemini API transient spike (%s). Retrying attempt %d/%d in 1.5s...", exc_str, attempt, max_retries)
                time.sleep(1.5)
                continue
            raise exc

    raise RuntimeError(f"Gemini API returned empty response after retries. Last error: {last_exception}")


# ---------------------------------------------------------------------------
# Fallback: Local algorithmic summariser
# ---------------------------------------------------------------------------

def _local_fallback_summarizer(descriptions: List[str]) -> str:
    """
    Programmatically assemble a structured problem statement without
    calling any external API.

    Strategy:
    1. Deduplicate and clean each description.
    2. Extract unique sentences across all descriptions (basic deduplication
       using normalized comparison).
    3. Construct the two-section output by assigning sentences to:
       - Problem Definition: all unique sentences (as bullet points).
       - Technical Challenges: heuristically identify sentences containing
         technical keywords and list them; otherwise note that a technical
         review is needed.

    This fallback is intentionally simple but produces a coherent,
    professionally formatted output that is clearly labelled as machine-
    generated from citizen inputs.

    Parameters
    ----------
    descriptions : List[str]
        Raw citizen complaint texts.

    Returns
    -------
    str
        A formatted two-section problem statement.
    """
    # Technical keywords that hint at infrastructure/engineering challenges.
    _TECH_KEYWORDS: frozenset[str] = frozenset({
        "road", "water", "drainage", "pipe", "electric", "bridge",
        "hospital", "school", "toilet", "sewage", "waste", "pump",
        "supply", "infrastructure", "repair", "construction", "leakage",
        "connection", "capacity", "shortage", "broken", "damaged",
        # Hindi / Devanagari keywords (common civic complaint terms):
        "सड़क", "पानी", "नाला", "बिजली", "पाइप", "अस्पताल",
        "स्कूल", "शौचालय", "मरम्मत", "निर्माण", "आपूर्ति", "टूटा",
    })

    # Step 1: Deduplicate descriptions using a case-normalized comparison set.
    seen_normalized: set[str] = set()
    unique_descriptions: list[str] = []

    for desc in descriptions:
        norm = " ".join(desc.lower().split())
        if norm not in seen_normalized and desc.strip():
            seen_normalized.add(norm)
            unique_descriptions.append(desc.strip())

    if not unique_descriptions:
        unique_descriptions = ["No valid complaints provided."]

    # Step 2: Split into sentences and deduplicate at sentence level.
    # Simple sentence splitting: split on period, newline, semicolon.
    import re
    all_sentences: list[str] = []
    seen_sentences: set[str] = set()

    for desc in unique_descriptions:
        # Split on common sentence-ending punctuation and line breaks.
        raw_sentences = re.split(r"[।|.\n;]+", desc)
        for sentence in raw_sentences:
            sentence = sentence.strip()
            norm_sent = " ".join(sentence.lower().split())
            if sentence and len(sentence) > 5 and norm_sent not in seen_sentences:
                seen_sentences.add(norm_sent)
                all_sentences.append(sentence)

    if not all_sentences:
        all_sentences = unique_descriptions

    # Step 3: Identify technical challenge sentences.
    tech_challenges: list[str] = []
    for sentence in all_sentences:
        lower_sent = sentence.lower()
        if any(kw in lower_sent for kw in _TECH_KEYWORDS):
            tech_challenges.append(sentence)

    # If no technical sentences identified, use all sentences as challenges.
    if not tech_challenges:
        tech_challenges = all_sentences

    # Step 4: Build the structured output.
    # --- Problem Definition section ---
    problem_bullets: str = "\n".join(f"  - {s}" for s in all_sentences)

    # --- Technical Challenges section ---
    challenge_bullets: str = "\n".join(f"  - {s}" for s in tech_challenges)

    statement: str = (
        f"[Note: This statement was generated by the local fallback summarizer "
        f"because the AI service was temporarily unavailable.]\n\n"
        f"1. Problem Definition\n"
        f"{problem_bullets}\n\n"
        f"2. Technical Challenges\n"
        f"{challenge_bullets}"
    )

    return statement
