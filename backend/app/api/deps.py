import uuid
from collections.abc import AsyncGenerator
from typing import Callable, Optional
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.exceptions import ForbiddenException, UnauthenticatedException
from app.core.security import decode_access_token
from app.db.session import get_db_session
from app.models.user import User, UserRole

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token", auto_error=False)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async for session in get_db_session():
        yield session


async def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    if not token:
        raise UnauthenticatedException("Authentication token is required.")

    payload = decode_access_token(token)
    user_id_raw: Optional[str] = payload.get("sub")
    if not user_id_raw:
        raise UnauthenticatedException("Invalid token subject.")

    try:
        user_uuid = uuid.UUID(str(user_id_raw))
    except (ValueError, TypeError):
        raise UnauthenticatedException("Invalid token subject format.")

    stmt = select(User).where(User.id == user_uuid)
    result = await db.execute(stmt)
    user = result.scalars().first()

    if not user:
        raise UnauthenticatedException("User no longer exists.")
    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.is_active:
        raise UnauthenticatedException("User account is deactivated.")
    return current_user


def require_roles(*allowed_roles: UserRole) -> Callable:
    async def role_checker(
        current_user: User = Depends(get_current_active_user),
    ) -> User:
        if current_user.role not in allowed_roles:
            raise ForbiddenException(
                "You do not have permission to access this resource."
            )
        return current_user

    return role_checker
