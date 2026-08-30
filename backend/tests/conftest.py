import pytest
from collections.abc import AsyncGenerator
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.api.deps import get_db
from app.core.security import hash_password
from app.db.base import Base
from app.main import app
from app.models.user import User, UserRole

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

engine = create_async_engine(TEST_DATABASE_URL, echo=False)
TestSessionLocal = async_sessionmaker(engine, expire_on_commit=False)


@pytest.fixture(scope="function")
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with TestSessionLocal() as session:
        yield session

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.fixture(scope="function")
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
async def seed_users(db_session: AsyncSession):
    pw_hash = hash_password("DevPassword123!")
    users_data = [
        ("citizen@test.local", "Raghu Citizen", UserRole.CITIZEN),
        ("student@test.local", "Priya Student", UserRole.STUDENT),
        ("university@test.local", "Dr. Verma University", UserRole.UNIVERSITY),
        ("industry@test.local", "Tata Industry", UserRole.INDUSTRY),
        ("government@test.local", "Jharkhand Government", UserRole.GOVERNMENT),
    ]
    for email, full_name, role in users_data:
        u = User(
            email=email,
            full_name=full_name,
            password_hash=pw_hash,
            role=role,
            is_verified=True,
            is_active=True,
        )
        db_session.add(u)
    await db_session.commit()
