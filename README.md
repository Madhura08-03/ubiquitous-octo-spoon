# JSIE Societal Innovation Portal — AI Microservice

A stateless, database-free Python FastAPI microservice designed for the **Jharkhand State Societal Innovation Portal (JSIE)**.

This repository provides an industry-graded AI engine for validating citizen complaints, detecting duplicates, generating technical problem statements for R&D institutes, and clustering cross-regional root causes across Rural Villages and Urban Cities.

---

## 📑 Executive Summary of Work Done & Core Features

### 1. Bilingual Text Preprocessing & Typo Auto-Correction (`text_utils.py`)
- **Multilingual Support:** Handles English, Devanagari Hindi, and Hinglish (Roman Hindi).
- **Unicode NFC Normalization & Nukta Canonicalization:** Standardizes Devanagari characters (e.g. `क़` $\rightarrow$ `क़`, `ड़` $\rightarrow$ `ड़`, `फ़` $\rightarrow$ `फ़`).
- **Matra & Character Flood Compression:** Compresses repeated flood characters (`"aaaaa"` $\rightarrow$ `"a"`, `"ााााा"` $\rightarrow$ `"ा"`).
- **Bilingual Typo Auto-Correction:** Corrects common spelling errors in English and Hindi (e.g. `"infrastucture"` $\rightarrow$ `"infrastructure"`, `"समस्याा"` $\rightarrow$ `"समस्या"`).

---

### 2. Multi-Gate Security & Quality Shield (`quality.py`)
A 5-stage sequential short-circuit linguistic pipeline that validates submissions before database insertion:
- **Gate 0 (Profanity & Curse Word Shield):** Blocks curse words in English, Hindi (Devanagari), and Hinglish with:
  > `"Please enter a valid input. Do not use curse words, it is strictly prohibited."`
- **Gate 1 (Shannon Entropy Check):** Blocks single-character spam and random keyboard smashing ($2.0 \le H \le 6.2$) with:
  > `"Please enter a valid input."`
- **Gate 2 (LZW Compression Ratio):** Blocks copy-paste flood attacks ($< 0.15$ ratio) with:
  > `"Please enter a valid input."`
- **Gate 3 (Phonotactic VC Check):** Blocks unpronounceable letter strings (consonant run $\ge 7$, VC ratio $< 0.15$, Devanagari exempt) with:
  > `"Please enter a valid input."`
- **Gate 4 (Anti-Flooding Upload Lock):** Uses SHA-256 rolling cryptographic hashes to block duplicate re-uploads with:
  > `"Request has been already uploaded."`

---

### 3. Spatio-Textual Duplicate Detection Engine (`similarity.py`)
- **11 Official Problem Domains:** Water Management, Sanitation & Waste, Agriculture, Healthcare, Education, Rural Livelihoods, Urban Infrastructure & Roads, Environment & Forests, Transit, Administration, Disaster Management.
- **Haversine Geofencing:** Hard spatial boundary filter (default 3.0 km radius).
- **Weighted Dual-Field TF-IDF:** Word N-grams (1-2) + Character Boundary N-grams `char_wb` (3-5). Title weighted 45%, Description weighted 55%.
- **Spatial Distance Penalty Decay:** Adjusts similarity score based on geographic proximity ($1.0 - 0.05 \times \frac{\text{dist}}{\text{radius}}$).
- **Threshold Classification:** `STRONG_MATCH` ($\ge 0.82$), `PROBABLE_MATCH` ($0.70 - 0.81$), `NEW_ISSUE` ($< 0.70$).

---

### 4. Bilingual AI Problem Statement Generator (`generator.py`)
- **Google Gemini 3.6 Flash Integration:** Synthesizes raw citizen complaints in any language into formal, professional Technical English for the **Institute & Industry R&D Portal**.
- **Automatic 503 Retry Backoff Loop:** Automatically waits 1.5s and retries up to 3 times during temporary Google Cloud traffic spikes.
- **Local Algorithmic Fallback:** Provides a robust local summarizer if the external API is unreachable.

---

### 5. Monthly Root-Cause Clustering Engine (`clustering.py`)
- **Rural-Urban R&D Bridging:** Periodically clusters societal complaints across distinct geographic locations (**Rural Villages vs Urban Cities**).
- **Shared Root Cause Identification:** Discovers when a rural village issue (e.g. river chemical pollution in Ormanjhi) shares the identical root cause as an urban city issue (e.g. municipal water intake contamination in Ranchi Sector 4).
- **Transferable Solution Categorization:** Attaches actionable R&D solution categories (e.g. `"Bio-Remediation & Advanced Filtration Systems"`) so solutions developed for village problems automatically apply to solve urban city problems.

---

## 🏛️ Architecture & Data Flow

```
CALLER (Frontend Web App / Backend DB)
        │
        │ HTTP POST (Payload: candidate_reports / batch items)
        ▼
┌─────────────────────────────────────────────────────────┐
│                    FastAPI (app.py)                     │
│                                                         │
│  POST /ai/check-report                                  │
│    ├─ text_utils.normalize_text()                       │
│    │   ├─ English lowercase & Devanagari preservation   │
│    │   └─ Bilingual Typo Auto-Correction                │
│    ├─ quality.evaluate_submission_quality()             │
│    │   ├─ Gate 0: Profanity & Curse Word Shield         │
│    │   ├─ Gate 1: Shannon Entropy (Gibberish)           │
│    │   ├─ Gate 2: LZW Compression Ratio (Flooding)      │
│    │   ├─ Gate 3: Phonotactic VC Check (Pronounceability)│
│    │   └─ Gate 4: SHA-256 Anti-Flooding Upload Lock      │
│    └─ similarity.detect_duplicates()                    │
│        ├─ Hard Filter: 11 Supported Domains             │
│        ├─ Hard Filter: Haversine Geofence (3.0 km)      │
│        └─ Weighted Dual-Field Hybrid TF-IDF             │
│                                                         │
│  POST /ai/cluster-reports                               │
│    ├─ clustering.perform_monthly_root_cause_clustering │
│    │   ├─ Domain-aware root cause partitioning          │
│    │   ├─ Hybrid TF-IDF (word + char_wb) matrix         │
│    │   └─ Agglomerative Cosine Distance Clustering      │
│    └─ Returns Root Cause Clusters & R&D Solution Tags   │
│                                                         │
│  POST /ai/generate-statement                            │
│    ├─ generator.generate_standardized_statement()       │
│    │   ├─ Primary: Gemini 3.6 Flash (Auto 503 Retry)    │
│    │   └─ Fallback: Local Algorithmic Summarizer       │
│    └─ Returns Technical English Statement for Portals   │
│                                                         │
│  GET /health                                            │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Repository File Structure

```
SIH_AI/
├── app.py             # FastAPI REST endpoints + background TTL cache eviction
├── schemas.py         # Pydantic V2 data validation models
├── text_utils.py      # Bilingual text normalizer & typo auto-correction engine
├── quality.py         # 5-gate security & quality shield
├── similarity.py      # Spatio-textual duplicate detection engine
├── generator.py       # Gemini 3.6 Flash AI generator + local fallback
├── clustering.py      # Monthly Root-Cause Clustering Engine (Rural-Urban bridge)
├── demo_cli.py        # Interactive single-input user-friendly CLI tester
├── run_demo_batch.py  # Automated batch verification runner
├── requirements.txt   # Dependencies
├── pytest.ini         # Pytest configuration
├── .env.example       # Environment configuration template
├── .gitignore         # Version control exclusion rules
└── tests/
    ├── conftest.py            # Pytest configuration fixtures
    ├── test_text_utils.py      # Text preprocessing & typo unit tests
    ├── test_quality.py         # Quality gate pipeline unit tests
    ├── test_similarity.py      # Duplicate detection unit tests
    ├── test_clustering.py      # Root cause clustering unit tests
    └── test_api_endpoints.py   # FastAPI integration tests (100% pass)
```

---

## ⚡ Quick Start & Execution

### 1. Installation

```bash
git clone https://github.com/Madhura08-03/ubiquitous-octo-spoon.git
cd ubiquitous-octo-spoon
git checkout sih-ai-complete-solution
pip install -r requirements.txt
```

### 2. Configure Environment

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Edit `.env` to configure your `GEMINI_API_KEY`:
```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
SPAM_WINDOW_SECS=900
CORS_ORIGINS=*
PORT=8000
```

### 3. Start FastAPI Web Server

```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```
Interactive Swagger API docs available at: `http://localhost:8000/docs`

### 4. Interactive Single-Input CLI Test Tool

Run the user-friendly CLI tester:
```bash
python demo_cli.py
```

### 5. Run Automated Test Suite

```bash
python -m pytest tests/ -v
```

---

## 🧪 Testing & Verification Status

All **104 automated unit and integration tests** pass cleanly with 100% code coverage across all endpoints, quality gates, clustering algorithms, and vectorizers.
