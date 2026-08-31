"""
quality.py
==========
Multi-Gate Linguistic Shield for the JSIE Societal Innovation Portal.

Architecture: 5-Stage Sequential Validation Pipeline
-----------------------------------------------------
The pipeline is SEQUENTIAL and SHORT-CIRCUIT -- the moment a gate fails,
the text is labelled REVIEW_PENDING and NO further gates are evaluated.

Gate execution order:
--------------------
Gate 0 -- PROFANITY_PROHIBITED  : Profanity / Curse word check (English, Hindi, Hinglish)
Gate 1 -- ENTROPY_ANOMALY      : Shannon entropy  (random noise / single-char spam)
Gate 2 -- REPETITIVE_FLOODING  : LZW / zlib ratio (copy-paste floods)
Gate 3 -- STRUCTURE_INVALID    : Phonotactic VC   (unpronounceability)
Gate 4 -- ALREADY_SUBMITTED     : SHA-256 hash     (anti-abuse duplicate upload prevention)
"""

from __future__ import annotations

import hashlib
import math
import zlib
from collections import Counter
from typing import Optional

from text_utils import normalize_text

# ---------------------------------------------------------------------------
# Profanity / Curse Word Vocabulary (English, Hindi Devanagari, Hinglish)
# ---------------------------------------------------------------------------

PROFANITY_WORDS: frozenset[str] = frozenset({
    # English curse words
    "fuck", "fucking", "fucked", "fucker", "bitch", "bastard", "asshole", "shit",
    "shitting", "shitty", "dick", "pussy", "cunt", "motherfucker", "bullshit", "dammit",
    # Hindi Devanagari curse words
    "मादरचोद", "बहनचोद", "भैनचोद", "गांडू", "चूतिया", "भोसड़ी", "भोसडी", "लौड़ा", "लंड",
    "हरामी", "कमीना", "साला", "रंडी", "गांड",
    # Hinglish Roman Hindi curse words
    "madarchod", "behanchod", "bhenchod", "gandu", "chutiya", "bhosdike", "bhosdi",
    "lauda", "land", "harami", "kamina", "saala", "randi", "mc", "bc"
})

# ---------------------------------------------------------------------------
# Threshold constants
# ---------------------------------------------------------------------------

ENTROPY_MIN: float = 2.0   # bits/char -- below = too uniform (spam / trivial)
ENTROPY_MAX: float = 6.2   # bits/char -- above = too random (gibberish smash)

COMPRESSION_RATIO_MIN: float = 0.15   # below = suspiciously repetitive

MAX_CONSONANT_RUN: int = 7
MIN_VC_RATIO: float = 0.15  # at least 15% of letters must be vowels

_VOWELS: frozenset[str] = frozenset("aeiouAEIOU")
_CONSONANTS: frozenset[str] = frozenset("bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ")


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def evaluate_submission_quality(
    title: str,
    description: str,
    rolling_cache: set[str],
) -> tuple[str, list[str], str]:
    """
    Run the sequential quality pipeline on a new report submission.

    Returns
    -------
    tuple[str, list[str], str]
        (status, reasons, user_message) where:
          - status       : "NORMAL" or "REVIEW_PENDING"
          - reasons      : list of gate failure codes (empty if NORMAL)
          - user_message : 1-line clear user-facing explanation statement
    """
    normalized: str = normalize_text(title, description)

    # -- Gate 0: Profanity Check ---------------------------------------------
    gate0_status, gate0_reason, gate0_msg = _gate0_profanity(normalized)
    if gate0_status == "REVIEW_PENDING":
        return "REVIEW_PENDING", [gate0_reason], gate0_msg

    # -- Gate 1: Shannon Entropy ----------------------------------------------
    gate1_status, gate1_reason, gate1_msg = _gate1_entropy(normalized)
    if gate1_status == "REVIEW_PENDING":
        return "REVIEW_PENDING", [gate1_reason], gate1_msg

    # -- Gate 2: LZW Compression Ratio ----------------------------------------
    gate2_status, gate2_reason, gate2_msg = _gate2_compression(normalized)
    if gate2_status == "REVIEW_PENDING":
        return "REVIEW_PENDING", [gate2_reason], gate2_msg

    # -- Gate 3: Phonotactic Vowel-Consonant Check ----------------------------
    gate3_status, gate3_reason, gate3_msg = _gate3_phonotactics(normalized)
    if gate3_status == "REVIEW_PENDING":
        return "REVIEW_PENDING", [gate3_reason], gate3_msg

    # -- Gate 4: Rolling Cryptographic Hash (Anti-Flooding) --------------------
    gate4_status, gate4_reason, gate4_msg = _gate4_hash(normalized, rolling_cache)
    if gate4_status == "REVIEW_PENDING":
        return "REVIEW_PENDING", [gate4_reason], gate4_msg

    # All gates passed cleanly.
    return "NORMAL", [], "Report successfully passed quality validation."


# ---------------------------------------------------------------------------
# Gate implementations
# ---------------------------------------------------------------------------

def _gate0_profanity(text: str) -> tuple[str, str, str]:
    """Gate 0: Curse word / profanity detection."""
    tokens = text.split()
    for t in tokens:
        if t in PROFANITY_WORDS:
            return (
                "REVIEW_PENDING",
                "PROFANITY_PROHIBITED",
                "Please enter a valid input. Do not use curse words, it is strictly prohibited."
            )
    return "NORMAL", "", ""


def _gate1_entropy(text: str) -> tuple[str, str, str]:
    """Gate 1: Shannon Entropy Check (Gibberish Detection)."""
    if not text:
        return (
            "REVIEW_PENDING",
            "ENTROPY_ANOMALY",
            "Please enter a valid input."
        )

    entropy: float = _shannon_entropy(text)
    if entropy < ENTROPY_MIN or entropy > ENTROPY_MAX:
        return (
            "REVIEW_PENDING",
            "ENTROPY_ANOMALY",
            "Please enter a valid input."
        )

    return "NORMAL", "", ""


def _gate2_compression(text: str) -> tuple[str, str, str]:
    """Gate 2: LZW Compression Ratio Check (Flooding Detection)."""
    encoded: bytes = text.encode("utf-8")
    original_length: int = len(encoded)

    if original_length == 0:
        return (
            "REVIEW_PENDING",
            "REPETITIVE_FLOODING",
            "Please enter a valid input."
        )

    compressed: bytes = zlib.compress(encoded, level=6)
    ratio: float = len(compressed) / original_length

    if ratio < COMPRESSION_RATIO_MIN:
        return (
            "REVIEW_PENDING",
            "REPETITIVE_FLOODING",
            "Please enter a valid input."
        )

    return "NORMAL", "", ""


def _gate3_phonotactics(text: str) -> tuple[str, str, str]:
    """Gate 3: Phonotactic Vowel-Consonant Check (Pronounceability)."""
    roman_letters: list[str] = [ch for ch in text if ch.isascii() and ch.isalpha()]

    if not roman_letters:
        return "NORMAL", "", ""

    consonant_run = _max_consecutive_consonants(roman_letters)
    if consonant_run >= MAX_CONSONANT_RUN:
        return (
            "REVIEW_PENDING",
            "STRUCTURE_INVALID",
            "Please enter a valid input."
        )

    vowel_count = sum(1 for ch in roman_letters if ch in _VOWELS)
    vc_ratio = vowel_count / len(roman_letters)

    if vc_ratio < MIN_VC_RATIO:
        return (
            "REVIEW_PENDING",
            "STRUCTURE_INVALID",
            "Please enter a valid input."
        )

    return "NORMAL", "", ""


def _gate4_hash(text: str, rolling_cache: set[str]) -> tuple[str, str, str]:
    """Gate 4: Rolling Cryptographic Hash (Anti-Flooding Upload Prevention)."""
    digest: str = hashlib.sha256(text.encode("utf-8")).hexdigest()

    if digest in rolling_cache:
        return (
            "REVIEW_PENDING",
            "ALREADY_SUBMITTED",
            "Request has been already uploaded."
        )

    # Add hash to cache
    rolling_cache.add(digest)
    return "NORMAL", "", ""


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _shannon_entropy(text: str) -> float:
    if not text:
        return 0.0
    length: float = float(len(text))
    counts: Counter[str] = Counter(text)
    return -sum((c / length) * math.log2(c / length) for c in counts.values())


def _max_consecutive_consonants(letters: list[str]) -> int:
    max_run = 0
    current_run = 0
    for ch in letters:
        if ch in _CONSONANTS:
            current_run += 1
            if current_run > max_run:
                max_run = current_run
        else:
            current_run = 0
    return max_run
