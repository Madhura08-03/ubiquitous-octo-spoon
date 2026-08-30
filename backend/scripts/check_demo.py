"""
Comprehensive Demo Health Check Script for Samanvay / JSIE
Read-only validation of the development/demo database.
Exit Code 0 = Healthy, 1 = Error / Problem detected.
"""

import asyncio
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from sqlalchemy import func, select
from app.db.session import AsyncSessionLocal
from app.models.audit_log import AuditLog
from app.models.points_event import PointsEvent
from app.models.raw_report import RawReport
from app.models.solution import IndustryReviewStatus, Solution, SolutionStatus
from app.models.standardized_problem import StandardizedProblem
from app.models.team import Team
from app.models.team_member import TeamMember
from app.models.user import User, UserRole


async def run_demo_health_check() -> int:
    print("=" * 55)
    print("        Samanvay / JSIE Demo Health Check")
    print("=" * 55)

    all_passed = True

    async with AsyncSessionLocal() as db:
        # 1. Users Check
        users_stmt = select(func.count(User.id))
        user_cnt = (await db.execute(users_stmt)).scalar() or 0
        roles_stmt = select(User.role).distinct()
        distinct_roles = (await db.execute(roles_stmt)).scalars().all()
        has_all_roles = all(
            r in distinct_roles
            for r in [
                UserRole.CITIZEN,
                UserRole.STUDENT,
                UserRole.UNIVERSITY,
                UserRole.INDUSTRY,
                UserRole.GOVERNMENT,
            ]
        )
        if user_cnt >= 5 and has_all_roles:
            print(f"Users ({user_cnt} users, all 5 roles):        PASS")
        else:
            print(f"Users ({user_cnt} users, roles: {distinct_roles}): FAIL")
            all_passed = False

        # 2. Problems Check
        prob_stmt = select(func.count(StandardizedProblem.id))
        prob_cnt = (await db.execute(prob_stmt)).scalar() or 0
        if prob_cnt >= 6:
            print(f"Problems ({prob_cnt} standardized):        PASS")
        else:
            print(f"Problems ({prob_cnt} standardized):         FAIL")
            all_passed = False

        # 3. Reports Check
        rep_stmt = select(func.count(RawReport.id))
        rep_cnt = (await db.execute(rep_stmt)).scalar() or 0
        if rep_cnt >= 1:
            print(f"Reports ({rep_cnt} raw reports):            PASS")
        else:
            print(f"Reports ({rep_cnt} raw reports):             FAIL")
            all_passed = False

        # 4. Teams Check
        team_stmt = select(func.count(Team.id))
        team_cnt = (await db.execute(team_stmt)).scalar() or 0
        if team_cnt >= 2:
            print(f"Teams ({team_cnt} teams):                  PASS")
        else:
            print(f"Teams ({team_cnt} teams):                   FAIL")
            all_passed = False

        # 5. Team Members Check
        mem_stmt = select(func.count(TeamMember.id))
        mem_cnt = (await db.execute(mem_stmt)).scalar() or 0
        if mem_cnt >= 2:
            print(f"Team Members ({mem_cnt} assigned):           PASS")
        else:
            print(f"Team Members ({mem_cnt} assigned):            FAIL")
            all_passed = False

        # 6. Solutions Check & Solution Proposer Validation
        sol_stmt = select(Solution)
        sols = (await db.execute(sol_stmt)).scalars().all()
        sol_cnt = len(sols)
        valid_proposers = True
        for sol in sols:
            proposer = (await db.execute(select(User).where(User.id == sol.proposed_by))).scalars().first()
            if not proposer or proposer.role != UserRole.UNIVERSITY:
                valid_proposers = False
                break

        if sol_cnt >= 2 and valid_proposers:
            print(f"Solutions ({sol_cnt} proposals, Mentor-led):  PASS")
        else:
            print(f"Solutions ({sol_cnt} proposals):              FAIL (Invalid proposers)")
            all_passed = False

        # 7. Points Events Check
        pts_stmt = select(func.count(PointsEvent.id))
        pts_cnt = (await db.execute(pts_stmt)).scalar() or 0
        if pts_cnt >= 3:
            print(f"Points Ledger ({pts_cnt} events):          PASS")
        else:
            print(f"Points Ledger ({pts_cnt} events):           FAIL")
            all_passed = False

        # 8. Audit Logs Check
        audit_stmt = select(func.count(AuditLog.id))
        audit_cnt = (await db.execute(audit_stmt)).scalar() or 0
        if audit_cnt >= 3:
            print(f"Audit Logs ({audit_cnt} records):             PASS")
        else:
            print(f"Audit Logs ({audit_cnt} records):              FAIL")
            all_passed = False

        # 9. Foreign Key & Business Relationship Integrity
        dangling_rep = (await db.execute(select(RawReport).where(RawReport.reporter_id.not_in(select(User.id))))).scalars().first()
        dangling_team = (await db.execute(select(Team).where(Team.problem_id.not_in(select(StandardizedProblem.id))))).scalars().first()
        dangling_sol = (await db.execute(select(Solution).where(Solution.problem_id.not_in(select(StandardizedProblem.id))))).scalars().first()

        # Check that team members are valid students
        non_student_members = (
            await db.execute(
                select(TeamMember).join(User, TeamMember.student_id == User.id).where(User.role != UserRole.STUDENT)
            )
        ).scalars().first()

        if not (dangling_rep or dangling_team or dangling_sol or non_student_members):
            print("Relationships & Foreign Keys:        PASS")
        else:
            print("Relationships & Foreign Keys:        FAIL")
            all_passed = False

        # 10. Government Boundary & Prototype Non-Fabrication Check
        gov_fake_approvals = (
            await db.execute(
                select(AuditLog).where(AuditLog.action == "GOVERNMENT_PROTOTYPE_APPROVED")
            )
        ).scalars().first()
        if not gov_fake_approvals:
            print("Government Prototype Boundary:       PASS (Zero Fabricated Approvals)")
        else:
            print("Government Prototype Boundary:       FAIL (Fabricated Approvals Detected)")
            all_passed = False

    print("-" * 55)
    if all_passed:
        print("OVERALL HEALTH STATUS:               HEALTHY (0)")
        return 0
    else:
        print("OVERALL HEALTH STATUS:               UNHEALTHY (1)")
        return 1


if __name__ == "__main__":
    exit_code = asyncio.run(run_demo_health_check())
    sys.exit(exit_code)
