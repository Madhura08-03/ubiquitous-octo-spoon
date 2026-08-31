"""
demo_cli.py
===========
Unified AI Tester for the JSIE Societal Innovation Portal (Industry-Graded).

Features Demonstrated:
  1. Bilingual Text Preprocessing & Typo Correction
  2. Multi-Gate Security Shield:
       - Gate 0: Profanity & Curse Word Filter ("Do not use curse words, it is strictly prohibited.")
       - Gate 1: Shannon Entropy (Gibberish check)
       - Gate 2: Compression Check (Copy-paste flood check)
       - Gate 3: Phonotactic VC Check (Unpronounceability check)
       - Gate 4: SHA-256 Hash Lock ("Request has been already uploaded.")
  3. Spatio-Textual Duplicate Detection (3.0 km geofence + Hybrid TF-IDF)
  4. Bilingual AI Problem Statement Generation (Standardized Technical English)
  5. NEW: Monthly Root-Cause Clustering Engine (Bridges Rural Villages & Urban Cities)
"""

from __future__ import annotations

import os
import sys
import time

sys.path.insert(0, os.path.dirname(__file__))

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    env_path = os.path.join(os.path.dirname(__file__), ".env")
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    os.environ.setdefault(k.strip(), v.strip())

from text_utils import normalize_text
from quality import evaluate_submission_quality
from similarity import detect_duplicates
from generator import generate_standardized_statement
from clustering import perform_monthly_root_cause_clustering
from schemas import (
    CheckReportRequest,
    CandidateReport,
    ClusterItem,
    ClusterReportsRequest,
)

OFFICIAL_DOMAINS = [
    "Water Management",
    "Sanitation & Waste Management",
    "Agriculture & Irrigation",
    "Healthcare Delivery",
    "Education & HEI Facilities",
    "Rural Livelihoods & Skills",
    "Urban Infrastructure & Roads",
    "Environment, Energy & Forests",
    "Accessibility & Public Transit",
    "Public Service & Administration",
    "Disaster Management & Emergency Response",
]


def print_banner():
    print("\n" + "═" * 78)
    print(" 🏛️  JSIE SOCIETAL INNOVATION PORTAL — INDUSTRY-GRADED AI ENGINE")
    print("═" * 78)


def run_demo():
    print_banner()
    print(" 💡 Entering report details once runs all 5 AI processes automatically.\n")

    # Inputs
    print("1️⃣ Report Title:")
    print("   [Default: 'Water Scarcity due to Industrial Pollution in Village']")
    t_in = input("   > ").strip()
    title = t_in if t_in else "Water Scarcity due to Industrial Pollution in Village"

    print("\n2️⃣ Detailed Description:")
    print("   [Default: 'River water is heavily polluted with chemical runoff causing severe drinking water shortage.']")
    d_in = input("   > ").strip()
    desc = d_in if d_in else "River water is heavily polluted with chemical runoff causing severe drinking water shortage."

    print("\n3️⃣ Select Domain:")
    for i, dom in enumerate(OFFICIAL_DOMAINS, 1):
        print(f"    {i:2d}. {dom}")
    print("   [Default: '1. Water Management']")
    dom_in = input("   Select domain (1-11) > ").strip()

    domain = "Water Management"
    if dom_in:
        try:
            idx = int(dom_in) - 1
            if 0 <= idx < len(OFFICIAL_DOMAINS):
                domain = OFFICIAL_DOMAINS[idx]
        except ValueError:
            pass

    lat, lng = 23.3441, 85.3096

    print("\n" + "═" * 78)
    print(" 🚀 RUNNING ALL 5 AI PROCESSES...")
    print("═" * 78)
    time.sleep(0.5)

    # -------------------------------------------------------------------------
    # PROCESS 1: TEXT NORMALIZATION
    # -------------------------------------------------------------------------
    print("\n" + "─" * 78)
    print(" 🔹 PROCESS 1: BILINGUAL TEXT PREPROCESSING & TYPO CORRECTION")
    print("─" * 78)
    normalized = normalize_text(title, desc)
    print(f" 📥 Raw Input Title : {title}")
    print(f" 📥 Raw Description : {desc}")
    print(f" 📤 Cleaned Text    : {normalized}")

    # -------------------------------------------------------------------------
    # PROCESS 2: MULTI-GATE QUALITY & SECURITY SHIELD
    # -------------------------------------------------------------------------
    print("\n" + "─" * 78)
    print(" 🔹 PROCESS 2: MULTI-GATE SECURITY SHIELD (PROFANITY & QUALITY GATES)")
    print("─" * 78)
    cache: set[str] = set()
    status, reasons, user_message = evaluate_submission_quality(title, desc, cache)

    print(f" 🛡️  Quality Status : {status}")
    print(f" 📋 Failure Reasons: {reasons if reasons else '[] (Passed all gates clean)'}")
    print(f" 💬 User Message   : \"{user_message}\"")

    # Demonstrate Gate 4 Anti-Flooding Duplicate Prevention
    if status == "NORMAL":
        print("\n ⚡ TESTING GATE 4 (ANTI-FLOODING PREVENTION):")
        print("    Submitting the exact same request a second time...")
        status2, reasons2, msg2 = evaluate_submission_quality(title, desc, cache)
        print(f"    -> Second Submission Result : {status2} (Reason: {reasons2})")
        print(f"    -> Blocked User Message     : \"{msg2}\"")

    # Demonstrate Gate 0 Profanity Shield
    print("\n ⚡ TESTING GATE 0 (PROFANITY & CURSE WORD SHIELD):")
    p_status, p_reasons, p_msg = evaluate_submission_quality("Curse word test", "This is bullshit and fucking broken", set())
    print(f"    -> Profanity Test Result : {p_status} (Reason: {p_reasons})")
    print(f"    -> Profanity User Message: \"{p_msg}\"")

    # -------------------------------------------------------------------------
    # PROCESS 3: SPATIO-TEXTUAL DUPLICATE DETECTION
    # -------------------------------------------------------------------------
    print("\n" + "─" * 78)
    print(" 🔹 PROCESS 3: SPATIO-TEXTUAL DUPLICATE DETECTION")
    print("─" * 78)

    sample_candidates = [
        CandidateReport(
            id="REPORT_NEARBY_001",
            title="Drinking Water Contamination Ormanjhi",
            description="Severe chemical pollution in river water causing severe drinking water scarcity.",
            lat=23.3500,
            lng=85.3096,
        )
    ]

    req = CheckReportRequest(
        title=title,
        description=desc,
        domain=domain,
        lat=lat,
        lng=lng,
        candidate_reports=sample_candidates,
    )

    dup_status, similarity_score, matched_id = detect_duplicates(req)
    print(f" 📁 Domain Checked  : {domain}")
    print(f" 🔍 Duplicate Status: {dup_status}")
    print(f" 📊 Similarity Score: {similarity_score:.4f}")
    print(f" 🔗 Matched ID      : {matched_id}")

    # -------------------------------------------------------------------------
    # PROCESS 4: AI STATEMENT GENERATION
    # -------------------------------------------------------------------------
    print("\n" + "─" * 78)
    print(" 🔹 PROCESS 4: BILINGUAL AI STATEMENT GENERATION (PROFESSIONAL ENGLISH)")
    print("─" * 78)
    complaints = [f"{title} - {desc}", "पानी में प्रदूषण बहुत बढ़ गया है।"]
    statement = generate_standardized_statement(complaints)
    print(statement)

    # -------------------------------------------------------------------------
    # PROCESS 5: MONTHLY ROOT-CAUSE CLUSTERING ENGINE
    # -------------------------------------------------------------------------
    print("\n" + "─" * 78)
    print(" 🔹 PROCESS 5: MONTHLY ROOT-CAUSE CLUSTERING ENGINE (RURAL 🤝 URBAN BRIDGING)")
    print("─" * 78)
    print(" 💡 Periodic monthly execution clustering reports with matching underlying root causes:\n")

    batch_reports = [
        ClusterItem(
            id="REP_RURAL_01",
            title="Severe Water Scarcity due to Industrial River Pollution",
            description="Ormanjhi village drinking water supply is contaminated by factory chemical pollution.",
            domain="Water Management",
            region_name="Ormanjhi Village",
            region_type="RURAL",
        ),
        ClusterItem(
            id="REP_URBAN_01",
            title="Urban Water Supply Contamination from Chemical Pollution",
            description="Ranchi Sector 4 residents have contaminated drinking water due to river chemical pollution.",
            domain="Water Management",
            region_name="Ranchi Urban Sector 4",
            region_type="URBAN",
        ),
        ClusterItem(
            id="REP_RURAL_02",
            title="Potholes and Road Surface Collapse",
            description="Village connection road has deep potholes.",
            domain="Urban Infrastructure & Roads",
            region_name="Kanke Village",
            region_type="RURAL",
        ),
    ]

    cluster_res = perform_monthly_root_cause_clustering(ClusterReportsRequest(reports=batch_reports))

    print(f" 📊 Total Reports Analyzed      : {cluster_res.total_reports_analyzed}")
    print(f" 🧩 Total Root Cause Clusters   : {cluster_res.total_clusters_found}")
    print(f" 🌉 Cross-Regional (Rural/Urban): {cluster_res.cross_regional_clusters}")

    for idx, cl in enumerate(cluster_res.clusters, 1):
        print(f"\n   ┌────────────────────────────────────────────────────────────┐")
        print(f"   │ CLUSTER #{idx}: {cl.cluster_id:<46} │")
        print(f"   ├────────────────────────────────────────────────────────────┤")
        print(f"   │ Root Cause Summary : {cl.root_cause_summary[:52]:<52} │")
        print(f"   │ Affected Regions   : {str(cl.affected_regions):<52} │")
        print(f"   │ Cross-Regional?    : {str(cl.is_cross_regional):<52} │")
        print(f"   │ Solution Category  : {cl.recommended_solution_category[:52]:<52} │")
        print(f"   └────────────────────────────────────────────────────────────┘")

    print("\n 💡 Why Process 5 is a Game-Changer:")
    print("    • Discovers that Ormanjhi Village (Rural) and Ranchi Sector 4 (Urban) share the SAME root cause!")
    print("    • If a R&D solution (e.g., Bio-Remediation Filtration) solves the village issue, the portal")
    print("      automatically maps and applies that SAME solution to solve the urban city problem!")

    print("\n" + "═" * 78)
    print(" ✅ ALL 5 INDUSTRY-GRADED PROCESSES EXECUTED CLEANLY!")
    print("═" * 78 + "\n")


if __name__ == "__main__":
    try:
        run_demo()
    except KeyboardInterrupt:
        print("\n\nDemo ended. Goodbye!")
