"""
text_utils.py
=============
Enhanced Bilingual text pre-processing utilities for the JSIE Societal Innovation Portal.

Supports three input modes:
  * Pure English
  * Pure Devanagari (Hindi / Hinglish written in Hindi script)
  * Mixed (Hinglish -- Roman-script Hindi interleaved with English)

Precision Enhancements:
-----------------------
1. Devanagari Canonical Normalization (NFC + Nukta handling).
2. English Typo & Spelling Auto-Correction for civic vocabulary (e.g., 'roadd' -> 'road', 'brokn' -> 'broken').
3. Optional Stopword Filtering for English and Hindi.
4. Character-flood compression (Latin and Devanagari matras).
5. URL normalization (<url> token).
"""

from __future__ import annotations

import re
import unicodedata

# ---------------------------------------------------------------------------
# Common Civic Typo Dictionary (English)
# ---------------------------------------------------------------------------

COMMON_ENGLISH_TYPOS: dict[str, str] = {
    # Road / Infrastructure
    "roadd": "road", "roaad": "road", "rade": "road", "rroad": "road",
    "brokn": "broken", "brokan": "broken", "borken": "broken", "brok": "broken",
    "pothol": "pothole", "pothols": "potholes", "pathole": "pothole", "potholl": "pothole",
    "streett": "street", "stret": "street",
    "bridg": "bridge", "brige": "bridge",
    "constuction": "construction", "constuct": "construction",

    # Water & Sanitation
    "waater": "water", "watar": "water", "wtr": "water", "waterr": "water",
    "dranage": "drainage", "drinage": "drainage", "drainag": "drainage", "dranag": "drainage",
    "pipee": "pipe", "pipp": "pipe",
    "leakege": "leakage", "lekage": "leakage", "leakag": "leakage",
    "cloggedd": "clogged", "cloged": "clogged", "clog": "clogged",
    "sewagee": "sewage", "sewag": "sewage",
    "garbag": "garbage", "garbagee": "garbage", "garbge": "garbage",

    # Public Services & Amenities
    "lightt": "light", "lite": "light", "ligth": "light",
    "electic": "electric", "electrc": "electric", "electrity": "electricity",
    "hospitl": "hospital", "hospial": "hospital", "hosptal": "hospital",
    "scool": "school", "skool": "school", "schol": "school",
    "traffc": "traffic", "trafic": "traffic", "traffik": "traffic",
    "accidnt": "accident", "acident": "accident", "accidentt": "accident",
    "demage": "damage", "damg": "damage", "damge": "damage", "damagedd": "damaged",
}

# ---------------------------------------------------------------------------
# Common Civic Typo Dictionary (Hindi - Devanagari & Hinglish Roman)
# ---------------------------------------------------------------------------

COMMON_HINDI_TYPOS: dict[str, str] = {
    # Devanagari Hindi Typos
    "सडक": "सड़क", "सरक": "सड़क",
    "पानीी": "पानी", "पानीि": "पानी",
    "नालीी": "नाली", "नालि": "नाली",
    "बिजलीी": "बिजली", "बिजलि": "बिजली",
    "गड्डा": "गड्ढा", "गड्डे": "गड्ढे", "गढा": "गड्ढा",
    "मरमत": "मरम्मत", "मरमतत": "मरम्मत",
    "असपताल": "अस्पताल",
    "स्कुल": "स्कूल", "सकुल": "स्कूल",
    "शौचालया": "शौचालय",
    "सफाईी": "सफाई",
    "कचराा": "कचरा",
    "टूटाी": "टूटा", "टुटा": "टूटा",
    "जलभरावव": "जलभराव", "जलभरव": "जलभराव",
    "समस्याा": "समस्या", "समसया": "समस्या",

    # Hinglish Roman Hindi Typos
    "panni": "paani", "panii": "paani",
    "sarak": "sadak", "sadaak": "sadak",
    "gaddha": "gaddhe", "gadha": "gaddhe",
    "bijili": "bijli", "bijlee": "bijli",
    "nali": "naali", "naalee": "naali",
    "khrab": "kharab", "khraab": "kharab",
}

# ---------------------------------------------------------------------------
# Stopword sets (English + Hindi)
# ---------------------------------------------------------------------------

ENGLISH_STOPWORDS: frozenset[str] = frozenset({
    "a", "an", "the", "and", "or", "but", "if", "because", "as", "until",
    "while", "of", "at", "by", "for", "with", "about", "against", "between",
    "into", "through", "during", "before", "after", "above", "below", "to",
    "from", "up", "down", "in", "out", "on", "off", "over", "under", "again",
    "further", "then", "once", "here", "there", "when", "where", "why", "how",
    "all", "any", "both", "each", "few", "more", "most", "other", "some", "such",
    "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very",
    "s", "t", "can", "will", "just", "don", "should", "now", "is", "am", "are",
    "was", "were", "be", "been", "being", "have", "has", "had", "having", "do",
    "does", "did", "doing"
})

HINDI_STOPWORDS: frozenset[str] = frozenset({
    "है", "हैं", "में", "की", "का", "को", "पर", "और", "से", "ने", "यह", "वह",
    "लिए", "रहे", "हो", "गा", "गे", "गी", "था", "थी", "थे", "एवं", "तथा",
    "द्वारा", "इस", "उस", "अपने", "अपनी", "अपने", "सकता", "सकती", "सकते",
    "होता", "होती", "होते", "किया", "किए", "कीजीए", "बहुत", "भी", "ही", "तो"
})

# ---------------------------------------------------------------------------
# Compiled regular-expression patterns
# ---------------------------------------------------------------------------

_RE_URL = re.compile(
    r"https?://\S+|www\.\S+",
    re.IGNORECASE | re.UNICODE,
)

_RE_PUNCTUATION = re.compile(
    r"[^\w\s\u0900-\u097F\u0980-\u09FF\uA8E0-\uA8FF\-<>]",
    re.UNICODE,
)

_RE_CHAR_FLOOD_LATIN = re.compile(
    r"([A-Za-z])\1{2,}",
    re.UNICODE,
)

_RE_CHAR_FLOOD_DEVA = re.compile(
    r"([\u093E-\u094C])\1{2,}",
    re.UNICODE,
)

_RE_WHITESPACE = re.compile(r"\s+", re.UNICODE)
_RE_DANGLING_HYPHEN = re.compile(r"(?<!\w)-|-(?!\w)", re.UNICODE)


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def correct_bilingual_typos(text: str) -> str:
    """
    Correct common English AND Hindi (Devanagari + Hinglish) spelling typos in civic complaint terms.
    e.g., 'roadd' -> 'road', 'brokn' -> 'broken', 'सडक' -> 'सड़क', 'panni' -> 'paani'.
    """
    tokens = text.split()
    corrected = []
    for t in tokens:
        t_corr = COMMON_ENGLISH_TYPOS.get(t, t)
        t_corr = COMMON_HINDI_TYPOS.get(t_corr, t_corr)
        corrected.append(t_corr)
    return " ".join(corrected)


def correct_english_typos(text: str) -> str:
    """Backward-compatible alias for correct_bilingual_typos."""
    return correct_bilingual_typos(text)


def normalize_text(
    title: str,
    description: str,
    remove_stopwords: bool = False,
    correct_typos: bool = True,
) -> str:
    """
    Normalize and merge a report's title and description into a single
    clean string suitable for downstream NLP.

    Processing pipeline:
        1. Concatenate title + description.
        2. Replace URLs with <url> placeholder token.
        3. NFC Unicode normalization + Devanagari Nukta canonicalization.
        4. Lower-case English characters only (Devanagari preserved).
        5. Strip punctuation / noise characters.
        6. Remove dangling hyphens at word boundaries.
        7. Compress character-flood patterns (Latin + Devanagari matras).
        8. Automatically correct common English & Hindi spelling typos (if correct_typos=True).
        9. Optionally filter out English and Hindi stopwords.
        10. Collapse whitespace into single spaces.

    Parameters
    ----------
    title : str
        The report title.
    description : str
        The report body text.
    remove_stopwords : bool, optional
        Whether to strip English and Hindi stopwords (default: False).
    correct_typos : bool, optional
        Whether to correct common English & Hindi typos (default: True).

    Returns
    -------
    str
        A single normalized, clean string.
    """
    combined: str = f"{title} {description}"

    # Step 2: Replace URLs
    combined = _RE_URL.sub("<url>", combined)

    # Step 3: Canonicalize Unicode (NFC) & Devanagari Nukta variants
    combined = unicodedata.normalize("NFC", combined)
    combined = _canonicalize_devanagari(combined)

    # Step 4: Lower-case English letters only
    combined = _lowercase_english_only(combined)

    # Step 5: Remove punctuation / noise
    combined = _RE_PUNCTUATION.sub(" ", combined)

    # Step 6: Remove dangling hyphens
    combined = _RE_DANGLING_HYPHEN.sub(" ", combined)

    # Step 7: Compress character flooding
    combined = _RE_CHAR_FLOOD_LATIN.sub(r"\1\1", combined)
    combined = _RE_CHAR_FLOOD_DEVA.sub(r"\1\1", combined)

    # Step 8: Bilingual (English + Hindi) Typo Correction
    if correct_typos:
        combined = correct_bilingual_typos(combined)

    # Step 9: Optional stopword filtering
    if remove_stopwords:
        tokens = combined.split()
        filtered = [
            t for t in tokens
            if t not in ENGLISH_STOPWORDS and t not in HINDI_STOPWORDS
        ]
        combined = " ".join(filtered)

    # Step 10: Collapse whitespace
    combined = _RE_WHITESPACE.sub(" ", combined).strip()

    return combined


def clean_single_field(text: str, remove_stopwords: bool = False, correct_typos: bool = True) -> str:
    """
    Clean a single text field (title or description) independently.
    Used for weighted multi-field vectorization.
    """
    return normalize_text(text, "", remove_stopwords=remove_stopwords, correct_typos=correct_typos)


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _lowercase_english_only(text: str) -> str:
    """Lower-case ASCII letters only, preserving Devanagari codepoints."""
    result: list[str] = []
    for ch in text:
        if ch.isascii() and ch.isalpha():
            result.append(ch.lower())
        else:
            result.append(ch)
    return "".join(result)


def _canonicalize_devanagari(text: str) -> str:
    """
    Canonicalize Devanagari character variants (Nukta-conjugated characters).
    e.g., U+0958 (क़) -> U+0915 U+093C, U+095F (ड़) -> U+0921 U+093C
    This ensures inconsistent Hindi keyboard input resolves to identical tokens.
    """
    nukta_map = {
        "\u0958": "\u0915\u093c",  # क़ -> क़
        "\u0959": "\u0916\u093c",  # ख़ -> ख़
        "\u095a": "\u0917\u093c",  # ग़ -> ग़
        "\u095b": "\u091c\u093c",  # ज़ -> ज़
        "\u095c": "\u0921\u093c",  # ड़ -> ड़
        "\u095d": "\u0922\u093c",  # ढ़ -> ढ़
        "\u095e": "\u092b\u093c",  # फ़ -> फ़
        "\u095f": "\u092f\u093c",  # य़ -> य़
    }
    for orig, rep in nukta_map.items():
        if orig in text:
            text = text.replace(orig, rep)
    return text
