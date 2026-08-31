"""
run_demo_batch.py
=================
Automated batch execution of all 4 features with complete terminal output logging.
"""
import os
import sys

# Ensure UTF-8 output on Windows terminal
sys.stdout.reconfigure(encoding='utf-8')

# Ensure env var is set
os.environ["GEMINI_API_KEY"] = "YOUR_GEMINI_API_KEY_HERE"

from text_utils import normalize_text
from quality import evaluate_submission_quality
from similarity import detect_duplicates
from generator import generate_standardized_statement
from schemas import CheckReportRequest, CandidateReport

def run_batch():
    w = 75
    print("=" * w)
    print("  JSIE AI MICROSERVICE -- AUTOMATED 4-FEATURE TEST RUN")
    print("=" * w)

    # PROCESS 1
    print("\n" + "=" * w)
    print("  [PROCESS 1: BILINGUAL TEXT PREPROCESSING]")
    print("=" * w)
    title1 = "Road Broken!!! सड़क पर पानी भर गया है"
    desc1 = "Sooooo bad condition near main market http://example.com/info. Contact us now!!!"
    norm1 = normalize_text(title1, desc1)
    print(f"INPUT TITLE       : {title1}")
    print(f"INPUT DESCRIPTION : {desc1}")
    print(f"-> OUTPUT (NORMALIZED TEXT): {norm1}")

    # PROCESS 2
    print("\n" + "=" * w)
    print("  [PROCESS 2: MULTI-GATE LINGUISTIC SHIELD]")
    print("=" * w)
    title2 = "Water Pipe Damage in Block C"
    desc2 = "The drinking water supply pipe near school has been leaking continuously for 5 days."
    cache = set()
    status2, reasons2 = evaluate_submission_quality(title2, desc2, cache)
    print(f"SUBMISSION 1 TITLE       : {title2}")
    print(f"SUBMISSION 1 DESCRIPTION : {desc2}")
    print(f"-> QUALITY STATUS        : {status2}")
    print(f"-> QUALITY REASONS       : {reasons2 if reasons2 else '[] (Passed all 4 gates clean)'}")

    print("\n--- Testing Gate 4 (Rapid Duplicate Abuse) ---")
    status2_dup, reasons2_dup = evaluate_submission_quality(title2, desc2, cache)
    print(f"SUBMISSION 2 (IDENTICAL REPEAT) STATUS : {status2_dup}")
    print(f"SUBMISSION 2 (IDENTICAL REPEAT) REASONS: {reasons2_dup}")

    print("\n--- Testing Gate 1 (Single-Character Spam) ---")
    status_spam, reasons_spam = evaluate_submission_quality("a", "a" * 150, set())
    print(f"SPAM SUBMISSION STATUS : {status_spam}")
    print(f"SPAM SUBMISSION REASONS: {reasons_spam}")

    # PROCESS 3
    print("\n" + "=" * w)
    print("  [PROCESS 3: SPATIO-TEXTUAL DUPLICATE DETECTION]")
    print("=" * w)
    candidates = [
        CandidateReport(
            id="REP_001_NEARBY",
            title="Road Damage Potholes Sector 4 Market",
            description="Deep potholes on sector 4 road near market causing accidents and vehicle damage.",
            lat=23.3500,  # ~0.7 km away
            lng=85.3096,
        ),
        CandidateReport(
            id="REP_002_FARAWAY",
            title="Road Damaged in Far Village",
            description="Deep potholes on the main road causing vehicle damage.",
            lat=23.5500,  # ~23 km away
            lng=85.3096,
        ),
    ]
    req = CheckReportRequest(
        title="Main Road Damaged with Deep Potholes",
        description="Large potholes have formed on Sector 4 road near market. Vehicles are getting damaged daily.",
        domain="Urban Infrastructure & Roads",
        lat=23.3441,
        lng=85.3096,
        candidate_reports=candidates,
    )
    dup_status, sim_score, match_id = detect_duplicates(req)
    print(f"NEW REPORT TITLE   : {req.title}")
    print(f"NEW REPORT DOMAIN  : {req.domain}")
    print(f"NEW REPORT LAT/LNG : ({req.lat}, {req.lng})")
    print(f"CANDIDATES SUPPLIED: {len(candidates)} (1 nearby ~0.7km, 1 far ~23km)")
    print(f"-> DUPLICATE STATUS: {dup_status}")
    print(f"-> SIMILARITY SCORE: {sim_score:.4f}")
    print(f"-> MATCHED REPORT ID: {match_id}")

    # PROCESS 4
    print("\n" + "=" * w)
    print("  [PROCESS 4: BILINGUAL AI STATEMENT GENERATION]")
    print("=" * w)
    raw_complaints = [
        "Road is completely broken near Sector 4 market in Ranchi, causing accidents daily.",
        "सड़क पर बहुत बड़े गड्ढे हैं और बारिश में जलभराव हो जाता है।",
        "Bahut zyada traffic jam aur vehicle damage ho raha hai damaged road ki wajah se."
    ]
    print("RAW COMPLAINTS SUBMITTED:")
    for i, c in enumerate(raw_complaints, 1):
        print(f"  {i}. {c}")

    print("\nCalling Gemini 3.6 Flash model...")
    stmt = generate_standardized_statement(raw_complaints)
    print("\n-> GENERATED STANDARDIZED STATEMENT:\n")
    print("-" * 75)
    print(stmt)
    print("-" * 75)
    print("\n" + "=" * w)
    print("  TEST COMPLETE -- ALL 4 PROCESSES EXECUTED")
    print("=" * w)

if __name__ == "__main__":
    run_batch()
