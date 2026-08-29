# Points, Leaderboards, and Analytics Specification

This document details the architecture, business rules, point categories, and aggregation algorithms powering the Samanvay / JSIE backend points engine and leaderboards.

---

## 1. Core Principles & Ledger Design

1. **PointsEvent Ledger is the Single Source of Truth**: User and institution totals are computed directly via `SUM(PointsEvent.points)` aggregation. There is no mutable `total_points` column on User entities.
2. **Deterministic & Backend-Controlled**: Clients can NEVER submit arbitrary points or alter point records. Points are awarded solely through verified backend milestones.
3. **Idempotency Guarantee**: Every point event is guarded against duplication via the uniqueness tuple `(user_id, entity_type, entity_id, reason)`.

---

## 2. Point Categories

### Category A: Milestone Engagement / Contribution Points (Active in MVP)
Awarded for active participation and verifiable project progression:
- `TEAM_FORMED` (50 pts): Awarded to University Mentor upon successful team creation.
- `STUDENT_TEAM_JOINED` (20 pts): Awarded to Student upon joining a project team.
- `INDUSTRY_REVIEW_COMPLETED` (50 pts): Awarded to Industry Reviewer upon completing a technical review.
- `INDUSTRY_APPROVED` (100 pts Mentor / 100 pts Student Team): Awarded when industry approves a submitted solution proposal.
- `PROTOTYPE_APPROVED` (200 pts): Reserved for future prototype verification milestone.
- `PROBLEM_RESOLVED` (300 pts): Reserved for final problem resolution milestone.

### Category B: Final JSIE Verified Solution Reward (Future Phase)
Calculated upon multi-stage solution verification (technical, domain, and government validation):
$$\text{Final Points} = \text{Base Complexity Points} \times \text{Novelty Multiplier} \times \text{Implementation Quality Factor}$$

- **Base Complexity**:
  - `LOW` = 100 pts
  - `MEDIUM` = 250 pts
  - `HIGH` = 500 pts
- **Novelty Multiplier**:
  - Score 70–100: `1.0x`
  - Score 40–69 (with manual approval): `0.8x`
  - Score < 40: `0.0x`
- **Implementation Quality Factor**:
  - Score 80–100: `1.2x`
  - Score 60–79: `1.0x`
  - Score < 60: `0.0x`

---

## 3. Student Team Distribution Algorithm

When a team milestone awards points to a student team:
1. Base allocation: `base = total_points // len(students)`
2. Remainder allocation: `remainder = total_points % len(students)`
3. Students are sorted deterministically by their UUID string representation (`sorted(student_ids, key=str)`).
4. The first `remainder` students receive `base + 1` points; remaining students receive `base` points.

---

## 4. Leaderboard Identity Models & MVP Limitations

- **University Leaderboard** (`GET /rankings/universities`): Aggregates points for verified accounts with `role == UNIVERSITY`. Sorted deterministically: `total_points DESC, successful_milestones DESC, full_name ASC`.
- **Industry Leaderboard** (`GET /rankings/industry`): Aggregates points for verified accounts with `role == INDUSTRY`. Sorted deterministically: `total_points DESC, successful_contributions DESC, full_name ASC`.
- **MVP Note**: In the current MVP, each verified University/Industry user account represents the institutional entity. Multi-user institutional aggregation under parent Organization models will be added in a future release.

---

## 5. Public Transparency & Analytics APIs

- `GET /public/problems`: Unauthenticated public problem transparency feed. **Zero citizen PII** (no reporter identity, contact details, or internal review metadata).
- `GET /public/analytics`: Real-time SQL database aggregation of societal impact metrics (`total_problems`, `total_reports`, `open_problems`, `in_progress_problems`, `resolved_problems`, `total_teams`, `total_solutions`, `industry_approved_solutions`, `approved_prototypes`, `domain_breakdown`).
