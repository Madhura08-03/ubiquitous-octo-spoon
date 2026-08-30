from functools import lru_cache
from typing import Literal
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

MAX_TEAM_STUDENTS: int = 8


class Settings(BaseSettings):
    APP_NAME: str = "Samanvay API"
    APP_VERSION: str = "0.1.0"
    ENVIRONMENT: Literal["development", "staging", "production", "testing"] = "development"
    DEBUG: bool = True

    # Centralized team limit
    MAX_TEAM_STUDENTS: int = MAX_TEAM_STUDENTS

    # Database: PostgreSQL (or SQLite fallback)
    DATABASE_URL: str = Field(
        default="sqlite+aiosqlite:///./samanvay.db",
        description="async Database URL for PostgreSQL or SQLite",
    )

    # JWT Authentication
    JWT_SECRET_KEY: str = "change-me-in-development-only-replace-in-production-with-strong-random-key"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # CORS
    FRONTEND_URL: str = "http://localhost:3000"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True,
    )

    @field_validator("DATABASE_URL")
    @classmethod
    def validate_database_url(cls, v: str) -> str:
        if not (v.startswith("postgresql+asyncpg://") or v.startswith("sqlite+aiosqlite://")):
            raise ValueError(
                "DATABASE_URL must start with 'postgresql+asyncpg://' for PostgreSQL "
                "or 'sqlite+aiosqlite://' for SQLite local fallback."
            )
        return v


@lru_cache
def get_settings() -> Settings:
    return Settings()
