import asyncio
import uuid
from sqlalchemy import select
from app.db.base import Base
from app.db.session import async_session_factory, engine
from app.models.domain import ProblemDomain
from app.models.standardized_problem import ProblemStatus, StandardizedProblem

DEMO_PROBLEMS = [
    {
        "title": "Severe Drinking Water Shortage in Ormanjhi Block",
        "domain": ProblemDomain.WATER_MANAGEMENT.value,
        "problem_summary": "Groundwater contamination and broken borewells leave 4 villages without safe potable drinking water.",
        "affected_community": "Ormanjhi Block Villages (approx. 3,500 residents)",
        "observed_impact": "Rise in waterborne gastrointestinal illnesses; daily travel over 3 km for basic water collection.",
        "latitude": 23.4795,
        "longitude": 85.4852,
        "priority_score": 92.0,
        "report_count": 48,
        "evidence_count": 14,
        "status": ProblemStatus.OPEN,
    },
    {
        "title": "Critical Pothole & Bridge Subsidence on NH-33 Section",
        "domain": ProblemDomain.ROADS_INFRASTRUCTURE.value,
        "problem_summary": "Extensive structural deterioration and monsoon waterlogging creating recurring heavy freight bottlenecks and accidents.",
        "affected_community": "Commuters and freight transporters between Ranchi and Ramgarh",
        "observed_impact": "Frequent fatal vehicle rollovers and emergency transport delays exceeding 45 minutes.",
        "latitude": 23.5821,
        "longitude": 85.5134,
        "priority_score": 85.5,
        "report_count": 31,
        "evidence_count": 9,
        "status": ProblemStatus.OPEN,
    },
    {
        "title": "Unsegregated Waste Accumulation Near Sector 4 Market",
        "domain": ProblemDomain.ENVIRONMENT_WASTE.value,
        "problem_summary": "Open dumping ground overflowing with plastic waste and municipal runoff obstructing public drainage.",
        "affected_community": "Sector 4 marketplace shopkeepers and nearby residential colony",
        "observed_impact": "Foul odor, rampant vector breeding, and recurrent localized monsoon flash floods.",
        "latitude": 23.3725,
        "longitude": 85.3340,
        "priority_score": 68.0,
        "report_count": 19,
        "evidence_count": 6,
        "status": ProblemStatus.OPEN,
    },
    {
        "title": "Frequent High-Voltage Transmission Line Tripping in Kanke",
        "domain": ProblemDomain.ENERGY_ELECTRICITY.value,
        "problem_summary": "Overloaded local substation transformers causing erratic voltage spikes and 12-hour blackouts daily.",
        "affected_community": "Kanke rural agricultural hub and local milk refrigeration units",
        "observed_impact": "Spoilage of perishable produce and inability to run agricultural tube-well pumps.",
        "latitude": 23.4289,
        "longitude": 85.3211,
        "priority_score": 74.0,
        "report_count": 22,
        "evidence_count": 5,
        "status": ProblemStatus.UNDER_INVESTIGATION,
    },
    {
        "title": "Lack of Cold Storage Facility for Tomato Harvest in Bero",
        "domain": ProblemDomain.AGRICULTURE.value,
        "problem_summary": "Smallholder farmers lack affordable decentralized preservation systems, resulting in severe post-harvest distress sales.",
        "affected_community": "Bero farming collective (500+ farmer families)",
        "observed_impact": "Over 35% produce loss each season and deep farmer debt cycles.",
        "latitude": 23.2798,
        "longitude": 85.0886,
        "priority_score": 79.5,
        "report_count": 27,
        "evidence_count": 8,
        "status": ProblemStatus.OPEN,
    },
    {
        "title": "Primary Health Centre Sanitation and Water Access Deficit",
        "domain": ProblemDomain.HEALTHCARE_SANITATION.value,
        "problem_summary": "Rural clinic lacks running chlorinated water in maternal delivery ward and has non-functional waste incinerator.",
        "affected_community": "Patients across 8 surrounding panchayats",
        "observed_impact": "Infection risks for newborn infants and mothers during emergency post-natal care.",
        "latitude": 23.1890,
        "longitude": 85.2401,
        "priority_score": 88.0,
        "report_count": 36,
        "evidence_count": 11,
        "status": ProblemStatus.OPEN,
    },
]


async def seed_problems():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session_factory() as session:
        for p_data in DEMO_PROBLEMS:
            stmt = select(StandardizedProblem).where(StandardizedProblem.title == p_data["title"])
            result = await session.execute(stmt)
            existing_problem = result.scalars().first()

            if not existing_problem:
                new_problem = StandardizedProblem(
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
                session.add(new_problem)
                print(f"  [+] Created demo problem: {p_data['title']} (Priority: {p_data['priority_score']})")
            else:
                print(f"  [^] Demo problem already exists: {p_data['title']}")

        await session.commit()
    print("\nDemo problems seeding complete.")


if __name__ == "__main__":
    asyncio.run(seed_problems())
