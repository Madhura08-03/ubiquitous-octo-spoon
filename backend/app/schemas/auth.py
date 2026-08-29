from typing import Optional
from pydantic import BaseModel, field_validator
from app.schemas.user import UserPublic


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: str
    role: str
    iat: int
    exp: int


class LoginRequest(BaseModel):
    email: str
    password: str

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        return v.strip().lower()


class AuthenticatedUser(BaseModel):
    user: UserPublic
    token: Token
