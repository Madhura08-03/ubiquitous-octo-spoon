import asyncio
import uuid
from sqlalchemy import select
from app.core.security import hash_password
from app.db.base import Base
from app.db.session import async_session_factory, engine
from app.models.user import User, UserRole

DEV_USERS = [
    {
        "email": "citizen@test.local",
        "full_name": "Ramesh Citizen",
        "role": UserRole.CITIZEN,
        "is_verified": True,
    },
    {
        "email": "student@test.local",
        "full_name": "Aarav Student",
        "role": UserRole.STUDENT,
        "is_verified": True,
    },
    {
        "email": "student1@test.local",
        "full_name": "Priya Sharma (Student)",
        "role": UserRole.STUDENT,
        "is_verified": True,
    },
    {
        "email": "student2@test.local",
        "full_name": "Rahul Verma (Student)",
        "role": UserRole.STUDENT,
        "is_verified": True,
    },
    {
        "email": "university@test.local",
        "full_name": "Dr. Sunita Rao (University Mentor)",
        "role": UserRole.UNIVERSITY,
        "is_verified": True,
    },
    {
        "email": "industry@test.local",
        "full_name": "Vikram Mehta (Industry Lead)",
        "role": UserRole.INDUSTRY,
        "is_verified": True,
    },
    {
        "email": "government@test.local",
        "full_name": "Ananya Roy (Gov Officer)",
        "role": UserRole.GOVERNMENT,
        "is_verified": True,
    },
]

DEV_PASSWORD = "DevPassword123!"


async def seed_users():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session_factory() as session:
        password_hash = hash_password(DEV_PASSWORD)

        for u in DEV_USERS:
            stmt = select(User).where(User.email == u["email"])
            result = await session.execute(stmt)
            existing_user = result.scalars().first()

            if not existing_user:
                new_user = User(
                    id=uuid.uuid4(),
                    email=u["email"],
                    password_hash=password_hash,
                    full_name=u["full_name"],
                    role=u["role"],
                    is_verified=u["is_verified"],
                    is_active=True,
                )
                session.add(new_user)
                print(f"  [+] Created user: {u['email']} ({u['role'].value})")
            else:
                existing_user.is_verified = True
                print(f"  [^] User already exists: {u['email']}")

        await session.commit()
    print("\nDev users seeding complete.")


if __name__ == "__main__":
    asyncio.run(seed_users())
