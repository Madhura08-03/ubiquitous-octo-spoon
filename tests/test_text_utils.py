"""
tests/test_text_utils.py
========================
Unit tests for text_utils.normalize_text().

Coverage areas:
  - English lowercase conversion
  - Devanagari character preservation
  - URL replacement with <url> token
  - Punctuation stripping
  - Character flood compression (Latin + Devanagari matras)
  - Whitespace collapsing
  - Mixed (Hinglish) text handling
"""

import pytest
import sys
import os

# Add the parent directory to sys.path so tests can import project modules.
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from text_utils import normalize_text, _lowercase_english_only


class TestLowercaseEnglishOnly:
    """Tests for the _lowercase_english_only helper."""

    def test_pure_english_lowercased(self):
        assert _lowercase_english_only("HELLO WORLD") == "hello world"

    def test_devanagari_unchanged(self):
        hindi = "नमस्ते दुनिया"
        assert _lowercase_english_only(hindi) == hindi

    def test_mixed_preserves_devanagari(self):
        mixed = "Road सड़क Broken टूटा"
        result = _lowercase_english_only(mixed)
        assert result == "road सड़क broken टूटा"

    def test_digits_and_symbols_unchanged(self):
        assert _lowercase_english_only("ABC123!@#") == "abc123!@#"


class TestNormalizeText:
    """Integration tests for the full normalize_text pipeline."""

    # ── URL replacement ──────────────────────────────────────────────────────

    def test_http_url_replaced(self):
        result = normalize_text("Road broken", "See http://example.com for details")
        assert "<url>" in result
        assert "http://example.com" not in result

    def test_https_url_replaced(self):
        result = normalize_text("Issue", "Check https://gov.in/portal")
        assert "<url>" in result

    def test_www_url_replaced(self):
        result = normalize_text("Issue", "Visit www.example.org")
        assert "<url>" in result

    def test_no_url_unchanged(self):
        result = normalize_text("Road broken", "Water logging on main road")
        assert "<url>" not in result

    # ── English lowercase ────────────────────────────────────────────────────

    def test_english_lowercased(self):
        result = normalize_text("ROAD BROKEN", "WATER LOGGING DAILY")
        assert "road broken" in result
        assert "water logging daily" in result

    # ── Devanagari preservation ──────────────────────────────────────────────

    def test_devanagari_preserved(self):
        result = normalize_text("पानी की समस्या", "नलों में पानी नहीं आता")
        assert "पानी" in result
        assert "नलों" in result

    def test_hinglish_mixed(self):
        result = normalize_text("Road टूटी hai", "bahut problem हो रही है")
        # English lowercased, Devanagari preserved
        assert "road" in result
        assert "टूटी" in result
        assert "hai" in result

    # ── Punctuation removal ──────────────────────────────────────────────────

    def test_exclamation_removed(self):
        result = normalize_text("Road Broken!!!", "Fix it now!!!")
        assert "!" not in result

    def test_question_mark_removed(self):
        result = normalize_text("Why?", "When will it be fixed???")
        assert "?" not in result

    def test_comma_period_removed(self):
        result = normalize_text("Title, Part 1.", "Description. More info.")
        # Commas and periods should not appear in result (outside of <url>)
        assert "," not in result

    # ── Character flood compression ──────────────────────────────────────────

    def test_latin_flood_compressed(self):
        # "sooooo" -> "soo" (3+ same chars compressed to 2)
        result = normalize_text("sooooo bad", "this is teeeerrrible")
        # "sooooo" (6 'o's) should become "soo"
        assert "sooooo" not in result
        assert "so" in result  # at least "so" remains

    def test_single_flood_all_same(self):
        # "aaaaaa" -> "aa"
        result = normalize_text("aaaaaa", "bbbbbbb issue")
        assert "aaaaaa" not in result
        assert "bbbbbbb" not in result

    def test_devanagari_matra_flood_compressed(self):
        # A repeated matra (dependent vowel) 3+ times should be compressed to 2.
        # \u093E is the 'aa' matra (आ). Three in a row is spam.
        # Note: this produces a synthetic token not a real Hindi word.
        text_with_flood = "word" + "\u093E" * 5 + "end"
        result = normalize_text(text_with_flood, "desc")
        # The matra flood should be compressed from 5 to 2.
        assert "\u093E" * 5 not in result
        assert "\u093E" * 2 in result

    # ── Whitespace normalisation ─────────────────────────────────────────────

    def test_multiple_spaces_collapsed(self):
        result = normalize_text("Road   broken", "Very   bad   issue")
        assert "  " not in result   # No double spaces

    def test_newlines_collapsed(self):
        result = normalize_text("Road\nbroken", "Issue\n\n\ndesc")
        assert "\n" not in result

    def test_leading_trailing_stripped(self):
        result = normalize_text("  Road broken  ", "  Water issue  ")
        assert result == result.strip()

    # ── Output structure ─────────────────────────────────────────────────────

    def test_title_and_description_merged(self):
        result = normalize_text("road broken", "water problem")
        assert "road broken" in result
        assert "water problem" in result

    def test_empty_description_handled(self):
        # Should not crash on minimal input.
        result = normalize_text("road", "ok")
        assert isinstance(result, str)
        assert len(result) > 0

    # ── English & Hindi Typo Correction ──────────────────────────────────────

    def test_english_typo_correction(self):
        result = normalize_text("roadd brokn", "waater dranage leakege")
        assert "road broken" in result
        assert "water drainage leakage" in result

    def test_hindi_devanagari_typo_correction(self):
        result = normalize_text("सडक पर गड्डे", "पानीी की समस्याा")
        assert "सड़क" in result
        assert "गड्ढे" in result
        assert "पानी" in result
        assert "समस्या" in result

    def test_hinglish_typo_correction(self):
        result = normalize_text("sarak par gaddha", "panni aur bijili problem")
        assert "sadak" in result
        assert "gaddhe" in result
        assert "paani" in result
        assert "bijli" in result
