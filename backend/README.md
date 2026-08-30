# Samanvay / JSIE Backend — Complete Production-Ready API (A01–A20)

FastAPI backend providing PostgreSQL + SQLite async persistence, SQLAlchemy 2.0 ORM models, stateless JWT authentication, RBAC, citizen civic problem ingestion pipeline, decoupled AI contract stub, student problem discovery feed, mentor problem adoption & team formation, student team member assignments, industry solution review workflow, deterministic points ledger engine, university/industry leaderboards, zero-PII public problems & analytics APIs, deterministic Jharkhand demo seed dataset, and contract tests.

---

## 🛠️ Tech Stack (Locked)
- **Framework**: FastAPI (Python 3.11+)
- **Server**: Uvicorn ASGI
- **Validation**: Pydantic v2 & Pydantic-Settings
- **Database & ORM**: SQLAlchemy 2.0 (Async) + asyncpg (PostgreSQL) / aiosqlite (SQLite fallback)
- **Migrations**: Alembic
- **Security & Auth**: Argon2id password hashing (`argon2-cffi`) + Stateless JWT (`PyJWT`, HS256)
- **Testing**: pytest, pytest-asyncio, httpx (73 passing tests)

---

## 👥 Canonical Roles & Seeded Demo Accounts
Default password for all demo accounts: `DevPassword123!`

| Role | Name / Organization | Email | Key Demo Responsibility |
| :--- | :--- | :--- | :--- |
| **`CITIZEN`** | Ramesh Mahto (Ranchi Citizen) | `demo.citizen@samanvay.local` | Submits civic problem reports (`POST /reports`) |
| **`STUDENT`** | Pooja Kumari (IoT Lead) | `demo.student1@samanvay.local` | Discovers problems, leads Smart Water team |
| **`STUDENT`** | Rahul Verma (Full Stack Dev) | `demo.student2@samanvay.local` | Member of Smart Water team, earns milestone points |
| **`STUDENT`** | Ananya Sen (Hardware Dev) | `demo.student3@samanvay.local` | Member of Rural Road team |
| **`UNIVERSITY`** | Ranchi Institute of Technology | `demo.university@samanvay.local` | Adopts problems (`POST /teams`), assigns students (Rank #1) |
| **`UNIVERSITY`** | Birsa Institute of Technology | `demo.university2@samanvay.local` | Adopts problems, assigns students (Rank #2) |
| **`INDUSTRY`** | Jharkhand CleanTech Solutions Ltd | `demo.industry@samanvay.local` | Reviews solutions (`POST /solutions/{id}/industry-review`) (Rank #1) |
| **`INDUSTRY`** | Tata Steel Rural Infrastructure | `demo.industry2@samanvay.local` | Reviews solutions and provides mentorship (Rank #2) |
| **`GOVERNMENT`**| Dept of Drinking Water & Sanitation | `demo.government@samanvay.local` | Government reviewer (future prototype validation) |

---

## 🚀 Quickstart & Demo Setup

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Environment Configuration
```bash
cp .env.example .env
```

### 3. Seed Deterministic Jharkhand Demo Dataset
```bash
python scripts/seed_demo.py
```

### 4. Run Complete Test Suite (73 Tests)
```bash
pytest tests -v
```

### 5. Run API Server
```bash
uvicorn app.main:app --reload --port 8000
```
- **Interactive OpenAPI Documentation**: `http://localhost:8000/docs`
- **OpenAPI Contract Snapshot**: `docs/openapi-demo-contract.json`
- **Health Check**: `http://localhost:8000/health`
