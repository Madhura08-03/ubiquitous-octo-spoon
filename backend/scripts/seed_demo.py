"""
Deterministic, Idempotent Demo Seed Script for Samanvay / JSIE
Simulates a realistic Jharkhand societal problem-solving ecosystem.
Safe to rerun repeatedly without creating duplicate demo records.
"""

import asyncio
import uuid
import sys
import os

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from sqlalchemy import select
from app.core.points_config import POINT_CONFIG, PointReason
from app.core.security import hash_password
from app.db.base import Base
from app.db.session import AsyncSessionLocal, engine
from app.models.domain import ProblemDomain
from app.models.raw_report import RawReport, RawReportStatus
from app.models.solution import IndustryReviewStatus, Solution, SolutionStatus
from app.models.standardized_problem import ProblemStatus, StandardizedProblem
from app.models.team import Team, TeamStatus
from app.models.team_member import TeamMember
from app.models.user import User, UserRole
from app.services.points_service import PointsService

DEMO_PASSWORD = "DevPassword123!"

DEMO_USERS = [
    {
        "email": "demo.citizen@samanvay.local",
        "full_name": "Ramesh Mahto (Ranchi Citizen)",
        "role": UserRole.CITIZEN,
        "is_verified": True,
        "is_active": True,
    },
    {
        "email": "demo.student1@samanvay.local",
        "full_name": "Pooja Kumari (IoT Lead)",
        "role": UserRole.STUDENT,
        "is_verified": True,
        "is_active": True,
    },
    {
        "email": "demo.student2@samanvay.local",
        "full_name": "Rahul Verma (Full Stack Dev)",
        "role": UserRole.STUDENT,
        "is_verified": True,
        "is_active": True,
    },
    {
        "email": "demo.student3@samanvay.local",
        "full_name": "Ananya Sen (Hardware Engineer)",
        "role": UserRole.STUDENT,
        "is_verified": True,
        "is_active": True,
    },
    {
        "email": "demo.university@samanvay.local",
        "full_name": "Ranchi Institute of Technology (Mentor: Dr. Alok Sharma)",
        "role": UserRole.UNIVERSITY,
        "is_verified": True,
        "is_active": True,
    },
    {
        "email": "demo.university2@samanvay.local",
        "full_name": "Birsa Institute of Technology (Mentor: Prof. Meena Hansda)",
        "role": UserRole.UNIVERSITY,
        "is_verified": True,
        "is_active": True,
    },
    {
        "email": "demo.industry@samanvay.local",
        "full_name": "Jharkhand CleanTech Solutions Ltd (Reviewer: Neeraj Sinha)",
        "role": UserRole.INDUSTRY,
        "is_verified": True,
        "is_active": True,
    },
    {
        "email": "demo.industry2@samanvay.local",
        "full_name": "Tata Steel Rural Infrastructure Division",
        "role": UserRole.INDUSTRY,
        "is_verified": True,
        "is_active": True,
    },
    {
        "email": "demo.government@samanvay.local",
        "full_name": "Dept of Drinking Water & Sanitation, Govt of Jharkhand",
        "role": UserRole.GOVERNMENT,
        "is_verified": True,
        "is_active": True,
    },
]

DEMO_PROBLEMS = [
    {
        "title": "Groundwater Arsenic and Fluoride Contamination in Tupudana Area",
        "domain": ProblemDomain.WATER_MANAGEMENT.value,
        "problem_summary": "Critical groundwater contamination across 14 municipal borewells in Tupudana industrial-suburban cluster.",
        "affected_community": "Tupudana & Hatia residents (approx. 45,000 citizens)",
        "observed_impact": "High prevalence of fluorosis and gastrointestinal ailments; private tanker costs burdening daily wage earners.",
        "latitude": 23.2954,
        "longitude": 85.2987,
        "priority_score": 92.5,
        "report_count": 42,
        "evidence_count": 14,
        "status": ProblemStatus.ADOPTED,
    },
    {
        "title": "Rural Culvert Collapse Severing Agricultural Transport on Murhu Link Road",
        "domain": ProblemDomain.ROADS_INFRASTRUCTURE.value,
        "problem_summary": "Heavy monsoon flash flooding washed out key concrete culvert connecting 8 farming villages to Khunti market.",
        "affected_community": "Murhu Gram Panchayat (approx. 12,000 farmers)",
        "observed_impact": "Produce rotting in transit; 18km detour required for ambulances reaching sub-divisional hospital.",
        "latitude": 23.0642,
        "longitude": 85.2789,
        "priority_score": 78.0,
        "report_count": 28,
        "evidence_count": 9,
        "status": ProblemStatus.ADOPTED,
    },
    {
        "title": "Solar Cold Chain Breakdown at Primary Health Center in Dumka Rural",
        "domain": ProblemDomain.HEALTHCARE_SANITATION.value,
        "problem_summary": "Vaccine refrigeration failing due to inverter battery degradation in remote tribal health center.",
        "affected_community": "Kathikund & Gopikandar blocks (approx. 22,000 residents)",
        "observed_impact": "Childhood immunization drives delayed; antivenom supplies compromised during peak monsoon snakebite season.",
        "latitude": 24.2677,
        "longitude": 87.2486,
        "priority_score": 88.0,
        "report_count": 34,
        "evidence_count": 11,
        "status": ProblemStatus.OPEN,
    },
    {
        "title": "Micro-Irrigation Canal Siltation in Hazaribagh Multi-Crop Basin",
        "domain": ProblemDomain.AGRICULTURE.value,
        "problem_summary": "Extensive sand siltation blocking water delivery through check-dam feeder canals during rabi crop sowing.",
        "affected_community": "Barhi & Chauparan agricultural clusters",
        "observed_impact": "Wheat and mustard yield reductions estimated at 35% across 450 hectares.",
        "latitude": 23.9925,
        "longitude": 85.3637,
        "priority_score": 72.0,
        "report_count": 19,
        "evidence_count": 6,
        "status": ProblemStatus.OPEN,
    },
    {
        "title": "Kadma Market Organic Solid Waste Accumulation and Drainage Clogging",
        "domain": ProblemDomain.ENVIRONMENT_WASTE.value,
        "problem_summary": "Over 4 tonnes of unsegregated market waste rotting adjacent to Subarnarekha river tributary.",
        "affected_community": "Kadma wholesale market vendors and surrounding neighborhoods",
        "observed_impact": "Severe mosquito vector breeding; foul odor and toxic leachate draining into public storm channels.",
        "latitude": 22.7844,
        "longitude": 86.1622,
        "priority_score": 84.0,
        "report_count": 51,
        "evidence_count": 18,
        "status": ProblemStatus.OPEN,
    },
    {
        "title": "Substation Transformer Overheating and Rolling Blackouts in Giridih Rural",
        "domain": ProblemDomain.ENERGY_ELECTRICITY.value,
        "problem_summary": "33/11kV rural feeder transformer continuously tripping under peak evening heating loads.",
        "affected_community": "Tisri & Gawan block panchayats",
        "observed_impact": "Night irrigation pumps non-functional; village student study hours severely disrupted.",
        "latitude": 24.1864,
        "longitude": 86.3072,
        "priority_score": 81.0,
        "report_count": 39,
        "evidence_count": 10,
        "status": ProblemStatus.RESOLVED,
    },
]


async def seed_demo_data():
    print("[START] Starting Samanvay / JSIE Deterministic Demo Seed...")
    # Ensure all tables exist
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        # 1. Seed Demo Users
        user_map = {}
        for u_data in DEMO_USERS:
            stmt = select(User).where(User.email == u_data["email"])
            res = await db.execute(stmt)
            user = res.scalars().first()
            if not user:
                user = User(
                    id=uuid.uuid4(),
                    email=u_data["email"],
                    full_name=u_data["full_name"],
                    password_hash=hash_password(DEMO_PASSWORD),
                    role=u_data["role"],
                    is_verified=u_data["is_verified"],
                    is_active=u_data["is_active"],
                )
                db.add(user)
                await db.flush()
                print(f"  [+] Created User: {user.email} ({user.role.value})")
            else:
                print(f"  [*] User exists: {user.email}")
            user_map[u_data["email"]] = user

        # 2. Seed Standardized Problems
        prob_map = {}
        for p_data in DEMO_PROBLEMS:
            stmt = select(StandardizedProblem).where(StandardizedProblem.title == p_data["title"])
            res = await db.execute(stmt)
            prob = res.scalars().first()
            if not prob:
                prob = StandardizedProblem(
                    id=uuid.uuid4(),
                    title=p_data["title"],
                    domain=p_data["domain"],
                    problem_summary=p_data["problem_summary"],
                    affected_community=p_data["affected_community"],
                    observed_impact=p_data["observed_impact"],
                    latitude=p_data["latitude"],
                    longitude=p_data["longitude"],
                    priority_score=p_data["priority_score"],
                    report_count=p_data["report_count"],
                    evidence_count=p_data["evidence_count"],
                    status=p_data["status"],
                )
                db.add(prob)
                await db.flush()
                print(f"  [+] Created Standardized Problem: {prob.title[:45]}...")
            else:
                print(f"  [*] Problem exists: {prob.title[:45]}...")
            prob_map[p_data["title"]] = prob

        # 3. Seed Raw Reports for Tupudana Water Problem
        water_prob = prob_map["Groundwater Arsenic and Fluoride Contamination in Tupudana Area"]
        citizen = user_map["demo.citizen@samanvay.local"]
        raw_reports_data = [
            "Our municipal tubewell water turns reddish brown and smells metallic since Monday.",
            "Children in ward 4 getting yellow teeth and joint pain from borehole drinking water.",
            "Water testing in our block showed heavy fluoride; need immediate filtration solution.",
        ]
        for rep_text in raw_reports_data:
            stmt = select(RawReport).where(
                RawReport.reporter_id == citizen.id,
                RawReport.description == rep_text,
            )
            if not (await db.execute(stmt)).scalars().first():
                rep = RawReport(
                    id=uuid.uuid4(),
                    reporter_id=citizen.id,
                    title=rep_text[:35],
                    description=rep_text,
                    domain=ProblemDomain.WATER_MANAGEMENT.value,
                    latitude=23.2954,
                    longitude=85.2987,
                    status=RawReportStatus.PROCESSED,
                )
                db.add(rep)
                await db.flush()
                print(f"  [+] Created Raw Report: {rep.title}")

        # 4. Seed Teams (Mentor-led)
        uni1 = user_map["demo.university@samanvay.local"]
        stu1 = user_map["demo.student1@samanvay.local"]
        stu2 = user_map["demo.student2@samanvay.local"]

        team1_stmt = select(Team).where(Team.name == "Smart Water Innovation Team")
        team1 = (await db.execute(team1_stmt)).scalars().first()
        if not team1:
            team1 = Team(
                id=uuid.uuid4(),
                problem_id=water_prob.id,
                university_id=uni1.id,
                mentor_id=uni1.id,
                name="Smart Water Innovation Team",
                status=TeamStatus.ACTIVE,
            )
            db.add(team1)
            await db.flush()

            # Award TEAM_FORMED points to Mentor
            pts_val = POINT_CONFIG[PointReason.TEAM_FORMED]["university_points"]
            await PointsService.award_milestone_points(
                db=db,
                user_id=uni1.id,
                points=pts_val,
                reason=PointReason.TEAM_FORMED,
                entity_type="TEAM",
                entity_id=team1.id,
            )

            # Add Student 1 & 2
            for stu, role_str in [(stu1, "IoT Hardware Specialist"), (stu2, "Firmware & Analytics Dev")]:
                m = TeamMember(
                    id=uuid.uuid4(),
                    team_id=team1.id,
                    student_id=stu.id,
                    role_in_team=role_str,
                )
                db.add(m)
                # Award STUDENT_TEAM_JOINED points
                stu_pts = POINT_CONFIG[PointReason.STUDENT_TEAM_JOINED]["student_points"]
                await PointsService.award_milestone_points(
                    db=db,
                    user_id=stu.id,
                    points=stu_pts,
                    reason=PointReason.STUDENT_TEAM_JOINED,
                    entity_type="TEAM",
                    entity_id=team1.id,
                )
            print(f"  [+] Created Team: {team1.name} with 2 students and awarded points.")

        # Team 2: Rural Road Monitoring Team (BIT University)
        uni2 = user_map["demo.university2@samanvay.local"]
        stu3 = user_map["demo.student3@samanvay.local"]
        road_prob = prob_map["Rural Culvert Collapse Severing Agricultural Transport on Murhu Link Road"]

        team2_stmt = select(Team).where(Team.name == "Rural Road Monitoring Team")
        team2 = (await db.execute(team2_stmt)).scalars().first()
        if not team2:
            team2 = Team(
                id=uuid.uuid4(),
                problem_id=road_prob.id,
                university_id=uni2.id,
                mentor_id=uni2.id,
                name="Rural Road Monitoring Team",
                status=TeamStatus.ACTIVE,
            )
            db.add(team2)
            await db.flush()

            # Award TEAM_FORMED points
            pts_val = POINT_CONFIG[PointReason.TEAM_FORMED]["university_points"]
            await PointsService.award_milestone_points(
                db=db,
                user_id=uni2.id,
                points=pts_val,
                reason=PointReason.TEAM_FORMED,
                entity_type="TEAM",
                entity_id=team2.id,
            )

            m3 = TeamMember(
                id=uuid.uuid4(),
                team_id=team2.id,
                student_id=stu3.id,
                role_in_team="Civil Sensor Specialist",
            )
            db.add(m3)
            stu_pts = POINT_CONFIG[PointReason.STUDENT_TEAM_JOINED]["student_points"]
            await PointsService.award_milestone_points(
                db=db,
                user_id=stu3.id,
                points=stu_pts,
                reason=PointReason.STUDENT_TEAM_JOINED,
                entity_type="TEAM",
                entity_id=team2.id,
            )
            print(f"  [+] Created Team: {team2.name} with 1 student and awarded points.")

        # 5. Seed Solutions (Mentor-Proposed) & Industry Reviews
        ind1 = user_map["demo.industry@samanvay.local"]
        ind2 = user_map["demo.industry2@samanvay.local"]

        # Solution 1: Proposed by Uni 1 -> APPROVED
        sol1_stmt = select(Solution).where(Solution.title == "Solar-Powered Multi-Stage Arsenic Remediation Unit")
        sol1 = (await db.execute(sol1_stmt)).scalars().first()
        if not sol1:
            sol1 = Solution(
                id=uuid.uuid4(),
                problem_id=water_prob.id,
                team_id=team1.id,
                proposed_by=uni1.id,  # Proposed by University Mentor
                title="Solar-Powered Multi-Stage Arsenic Remediation Unit",
                description="Modular activated alumina and electro-coagulation filtration system powered by a 500W off-grid solar array.",
                status=SolutionStatus.APPROVED,
                industry_review_status=IndustryReviewStatus.APPROVED,
            )
            db.add(sol1)
            await db.flush()

            # Award INDUSTRY_APPROVED points to mentor + students
            await PointsService.award_team_industry_approval_points(
                db=db,
                mentor_id=uni1.id,
                student_ids=[stu1.id, stu2.id],
                solution_id=sol1.id,
            )

            # Award INDUSTRY_REVIEW_COMPLETED points to Industry 1
            ind_pts = POINT_CONFIG[PointReason.INDUSTRY_REVIEW_COMPLETED]["industry_points"]
            await PointsService.award_milestone_points(
                db=db,
                user_id=ind1.id,
                points=ind_pts,
                reason=PointReason.INDUSTRY_REVIEW_COMPLETED,
                entity_type="SOLUTION",
                entity_id=sol1.id,
            )
            print(f"  [+] Created Approved Solution: {sol1.title[:40]}... (Proposed by Mentor {uni1.email})")

        # Solution 2: Proposed by Uni 2 -> SUBMITTED (Live demo review target)
        sol2_stmt = select(Solution).where(Solution.title == "Acoustic Strain Gauge Culvert Early Warning Sensor")
        sol2 = (await db.execute(sol2_stmt)).scalars().first()
        if not sol2:
            sol2 = Solution(
                id=uuid.uuid4(),
                problem_id=road_prob.id,
                team_id=team2.id,
                proposed_by=uni2.id,  # Proposed by University Mentor
                title="Acoustic Strain Gauge Culvert Early Warning Sensor",
                description="Sub-surface piezoelectric sensors detecting structural displacement and flash flood pressure on rural bridges.",
                status=SolutionStatus.SUBMITTED,
                industry_review_status=IndustryReviewStatus.PENDING,
            )
            db.add(sol2)
            await db.flush()
            print(f"  [+] Created Submitted Solution (Live Target): {sol2.title[:40]}... (Proposed by Mentor {uni2.email})")

        # Solution 3: Proposed by Uni 1 -> INDUSTRY_REVIEW
        sol3_stmt = select(Solution).where(Solution.title == "Kadma Market Biomethanation and Soil Enricher Unit")
        sol3 = (await db.execute(sol3_stmt)).scalars().first()
        if not sol3:
            waste_prob = prob_map["Kadma Market Organic Solid Waste Accumulation and Drainage Clogging"]
            sol3 = Solution(
                id=uuid.uuid4(),
                problem_id=waste_prob.id,
                team_id=team1.id,
                proposed_by=uni1.id,  # Proposed by University Mentor
                title="Kadma Market Biomethanation and Soil Enricher Unit",
                description="Community-scale 2-tonne anaerobic bio-digester converting wet vegetable refuse into cooking gas and organic compost.",
                status=SolutionStatus.INDUSTRY_REVIEW,
                industry_review_status=IndustryReviewStatus.PENDING,
            )
            db.add(sol3)
            await db.flush()

            # Award INDUSTRY_REVIEW_COMPLETED points to Industry 2
            ind_pts = POINT_CONFIG[PointReason.INDUSTRY_REVIEW_COMPLETED]["industry_points"]
            await PointsService.award_milestone_points(
                db=db,
                user_id=ind2.id,
                points=ind_pts,
                reason=PointReason.INDUSTRY_REVIEW_COMPLETED,
                entity_type="SOLUTION",
                entity_id=sol3.id,
            )
            print(f"  [+] Created In-Review Solution: {sol3.title[:40]}... (Proposed by Mentor {uni1.email})")

        await db.commit()
        print("[DONE] Samanvay / JSIE Demo Seed Completed Successfully!")


if __name__ == "__main__":
    asyncio.run(seed_demo_data())
