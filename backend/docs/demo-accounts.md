# Samanvay / JSIE — Demo Account Credentials

> [!NOTE]
> These credentials are for **DEVELOPMENT AND DEMONSTRATION USE ONLY**.
> All demonstration accounts share the standard development password.

**Default Password for all Demo Accounts**: `DevPassword123!`

---

## 👥 Seeded Demonstration Accounts

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

## 🔑 Authentication Quick Test

```bash
curl -X POST http://localhost:8000/auth/token \
  -H "Content-Type: application/json" \
  -d '{"email": "demo.university@samanvay.local", "password": "DevPassword123!"}'
```
