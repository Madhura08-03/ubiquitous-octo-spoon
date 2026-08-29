from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.exceptions import UnauthenticatedException
from app.core.security import create_access_token, verify_password
from app.models.user import User
from app.schemas.auth import Token


class AuthService:
    @staticmethod
    async def get_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
        normalized_email = email.strip().lower()
        stmt = select(User).where(User.email == normalized_email)
        result = await db.execute(stmt)
        return result.scalars().first()

    @staticmethod
    async def authenticate_user(db: AsyncSession, email: str, password: str) -> User:
        user = await AuthService.get_user_by_email(db, email)
        if not user:
            raise UnauthenticatedException("Invalid email or password.")
        if not verify_password(password, user.password_hash):
            raise UnauthenticatedException("Invalid email or password.")
        if not user.is_active:
            raise UnauthenticatedException("User account is deactivated.")
        return user

    @staticmethod
    def generate_user_token(user: User) -> Token:
        token_str = create_access_token(subject=str(user.id), role=user.role.value)
        return Token(access_token=token_str, token_type="bearer")
