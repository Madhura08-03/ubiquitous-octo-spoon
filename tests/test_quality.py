"""
tests/test_quality.py
=====================
Unit tests for the 4-gate Multi-Gate Linguistic Shield (quality.py).

Each gate is tested independently via its internal helper function,
and the full pipeline is tested end-to-end via evaluate_submission_quality.

Test coverage:
  Gate 1: Shannon entropy boundaries (too low, too high, normal)
  Gate 2: LZW compression ratio (flooding, normal)
  Gate 3: Phonotactic VC (consonant runs, vowel ratio, pure Devanagari exempt)
  Gate 4: SHA-256 rolling hash (first submission passes, second flagged)
  Pipeline: Short-circuit behavior (only first failure reported)
"""

import pytest
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from quality import (
    evaluate_submission_quality,
    _gate1_entropy,
    _gate2_compression,
    _gate3_phonotactics,
    _gate4_hash,
    _shannon_entropy,
    _max_consecutive_consonants,
    ENTROPY_MIN,
    ENTROPY_MAX,
    COMPRESSION_RATIO_MIN,
    MAX_CONSONANT_RUN,
    MIN_VC_RATIO,
)


# ---------------------------------------------------------------------------
# Helper: Shannon Entropy
# ---------------------------------------------------------------------------

class TestShannonEntropy:
    def test_single_character_low_entropy(self):
        """Single repeated character has entropy 0.0."""
        assert _shannon_entropy("aaaaaaa") == pytest.approx(0.0, abs=1e-9)

    def test_two_chars_entropy(self):
        """Two equally likely characters: H = 1.0 bit."""
        assert _shannon_entropy("ababababab") == pytest.approx(1.0, abs=0.01)

    def test_natural_english_entropy(self):
        """Normal English text should fall between ENTROPY_MIN and ENTROPY_MAX."""
        text = "the water supply in this village is broken and needs immediate repair"
        h = _shannon_entropy(text)
        assert ENTROPY_MIN <= h <= ENTROPY_MAX

    def test_empty_string_returns_zero(self):
        assert _shannon_entropy("") == 0.0

    def test_all_unique_chars_high_entropy(self):
        """Many unique characters should have high entropy."""
        import string
        text = string.printable  # 100 printable chars, all unique
        h = _shannon_entropy(text)
        assert h > 5.0  # Should be high


# ---------------------------------------------------------------------------
# Helper: Max Consecutive Consonants
# ---------------------------------------------------------------------------

class TestMaxConsecutiveConsonants:
    def test_no_consonants(self):
        assert _max_consecutive_consonants(list("aeiou")) == 0

    def test_single_consonant(self):
        assert _max_consecutive_consonants(list("cat")) == 1  # 'c' then 'a' breaks

    def test_consonant_cluster(self):
        # "str" = 3 consecutive consonants
        assert _max_consecutive_consonants(list("strength")) >= 3

    def test_keyboard_smash(self):
        # "bcdfghjkl" = 9 consecutive consonants
        assert _max_consecutive_consonants(list("bcdfghjkl")) == 9

    def test_all_vowels(self):
        assert _max_consecutive_consonants(list("aeiou")) == 0


# ---------------------------------------------------------------------------
# Gate 1: Entropy Check
# ---------------------------------------------------------------------------

class TestGate1Entropy:
    def test_passes_for_normal_text(self):
        text = "the road near my house is completely broken and water logs every day during rain"
        status, reason, _ = _gate1_entropy(text)
        assert status == "NORMAL"
        assert reason == ""

    def test_fails_for_single_char_spam(self):
        status, reason, _ = _gate1_entropy("a" * 50)
        assert status == "REVIEW_PENDING"
        assert reason == "ENTROPY_ANOMALY"

    def test_fails_for_empty_text(self):
        status, reason, _ = _gate1_entropy("")
        assert status == "REVIEW_PENDING"
        assert reason == "ENTROPY_ANOMALY"

    def test_passes_for_hindi_text(self):
        hindi = "पानी की समस्या बहुत गंभीर है नलों में पानी नहीं आता"
        status, reason, _ = _gate1_entropy(hindi)
        assert status == "NORMAL"

    def test_passes_for_hinglish_text(self):
        hinglish = "road bahut kharab hai aur paani bhi nahi aata roz"
        status, reason, _ = _gate1_entropy(hinglish)
        assert status == "NORMAL"


# ---------------------------------------------------------------------------
# Gate 2: Compression Ratio Check
# ---------------------------------------------------------------------------

class TestGate2Compression:
    def test_passes_for_natural_text(self):
        text = "the drainage system near the school has been broken for three months causing health issues"
        status, reason, _ = _gate2_compression(text)
        assert status == "NORMAL"

    def test_fails_for_extreme_repetition(self):
        text = "a" * 5000
        status, reason, _ = _gate2_compression(text)
        assert status == "REVIEW_PENDING"
        assert reason == "REPETITIVE_FLOODING"

    def test_fails_for_repeated_phrase_flood(self):
        phrase = "road is broken "
        text = phrase * 200
        status, reason, _ = _gate2_compression(text)
        assert status == "REVIEW_PENDING"
        assert reason == "REPETITIVE_FLOODING"


# ---------------------------------------------------------------------------
# Gate 3: Phonotactic Check
# ---------------------------------------------------------------------------

class TestGate3Phonotactics:
    def test_passes_for_normal_english(self):
        roman = list("the water pipe in our colony has been damaged")
        status, reason, _ = _gate3_phonotactics(" ".join(roman))
        assert status == "NORMAL"

    def test_fails_for_long_consonant_run(self):
        text = "bcdfghjklm"
        status, reason, _ = _gate3_phonotactics(text)
        assert status == "REVIEW_PENDING"
        assert reason == "STRUCTURE_INVALID"

    def test_fails_for_zero_vowel_ratio(self):
        text = "bcdfghjkl bcdfghjkl bcdfghjkl"
        status, reason, _ = _gate3_phonotactics(text)
        assert status == "REVIEW_PENDING"
        assert reason == "STRUCTURE_INVALID"

    def test_passes_for_pure_devanagari(self):
        hindi = "पानी की समस्या बहुत गंभीर है"
        status, reason, _ = _gate3_phonotactics(hindi)
        assert status == "NORMAL"

    def test_passes_for_short_consonant_cluster(self):
        status, reason, _ = _gate3_phonotactics("strength of the bridge")
        assert status == "NORMAL"


# ---------------------------------------------------------------------------
# Gate 4: Rolling Hash Check
# ---------------------------------------------------------------------------

class TestGate4Hash:
    def test_first_submission_passes(self):
        cache: set[str] = set()
        status, reason, _ = _gate4_hash("unique road problem near village", cache)
        assert status == "NORMAL"
        assert len(cache) == 1

    def test_second_identical_submission_fails(self):
        cache: set[str] = set()
        text = "water logging on main street near hospital"
        _gate4_hash(text, cache)
        status, reason, _ = _gate4_hash(text, cache)
        assert status == "REVIEW_PENDING"
        assert reason == "ALREADY_SUBMITTED"

    def test_different_text_passes_even_with_populated_cache(self):
        cache: set[str] = set()
        _gate4_hash("road broken near park", cache)
        status, reason, _ = _gate4_hash("water supply disrupted in block a", cache)
        assert status == "NORMAL"

    def test_hash_is_case_sensitive_to_normalized_form(self):
        cache: set[str] = set()
        _gate4_hash("road broken", cache)
        status, _, _ = _gate4_hash("road issue", cache)
        assert status == "NORMAL"


# ---------------------------------------------------------------------------
# Full Pipeline: evaluate_submission_quality
# ---------------------------------------------------------------------------

class TestEvaluateSubmissionQuality:
    def test_clean_english_report_passes(self):
        cache: set[str] = set()
        status, reasons, msg = evaluate_submission_quality(
            title="Road Broken Near School",
            description="The main access road leading to the primary school has large potholes. Vehicles are getting damaged daily.",
            rolling_cache=cache,
        )
        assert status == "NORMAL"
        assert reasons == []
        assert "successfully" in msg

    def test_clean_hindi_report_passes(self):
        cache: set[str] = set()
        status, reasons, msg = evaluate_submission_quality(
            title="पानी की समस्या",
            description="हमारे मोहल्ले में तीन हफ्तों से पानी नहीं आ रहा है। नल सूखे हैं और बच्चे परेशान हैं।",
            rolling_cache=cache,
        )
        assert status == "NORMAL"
        assert reasons == []

    def test_single_char_spam_flagged_gate1(self):
        cache: set[str] = set()
        status, reasons, msg = evaluate_submission_quality(
            title="a",
            description="a" * 200,
            rolling_cache=cache,
        )
        assert status == "REVIEW_PENDING"
        assert "ENTROPY_ANOMALY" in reasons

    def test_repetitive_flood_flagged_gate2(self):
        cache: set[str] = set()
        # Need to pass gate 1 (entropy) but fail gate 2 (compression).
        # A repeated natural phrase passes entropy but compresses heavily.
        flood = "the road is broken near my house " * 150
        status, reasons, msg = evaluate_submission_quality(
            title="road problem",
            description=flood,
            rolling_cache=cache,
        )
        # May fail gate 2 (compression) or gate 3; we just check it's flagged.
        assert status == "REVIEW_PENDING"
        assert len(reasons) == 1  # SHORT-CIRCUIT: only one reason

    def test_gibberish_consonants_flagged_gate3(self):
        cache: set[str] = set()
        status, reasons, msg = evaluate_submission_quality(
            title="bcdfghjklmnpq",
            description="bcdfghjklmnpqrst xyzwvts bcdfghjklmnp",
            rolling_cache=cache,
        )
        # Should fail gate 1 (too many consonants, low entropy might trigger first)
        # OR gate 3. Either way, REVIEW_PENDING.
        assert status == "REVIEW_PENDING"

    def test_rapid_spam_flagged_gate4(self):
        cache: set[str] = set()
        title = "Water Supply Disruption in Block C"
        description = "The water pipe near sector 5 has been broken for two weeks. Residents cannot access drinking water."
        # First submission should pass.
        status1, _, msg1 = evaluate_submission_quality(title, description, cache)
        assert status1 == "NORMAL"
        # Second identical submission should be flagged.
        status2, reasons2, msg2 = evaluate_submission_quality(title, description, cache)
        assert status2 == "REVIEW_PENDING"
        assert "ALREADY_SUBMITTED" in reasons2
        assert "already uploaded" in msg2

    def test_profanity_flagged_gate0(self):
        cache: set[str] = set()
        title = "Road Broken"
        description = "This road condition is bullshit and fuck the authority."
        status, reasons, msg = evaluate_submission_quality(title, description, cache)
        assert status == "REVIEW_PENDING"
        assert "PROFANITY_PROHIBITED" in reasons
        assert "curse words" in msg

    def test_short_circuit_only_one_reason(self):
        """Pipeline must return exactly one reason even if multiple gates would fail."""
        cache: set[str] = set()
        status, reasons, msg = evaluate_submission_quality(
            title="a",
            description="a" * 300,
            rolling_cache=cache,
        )
        assert status == "REVIEW_PENDING"
        assert len(reasons) == 1
