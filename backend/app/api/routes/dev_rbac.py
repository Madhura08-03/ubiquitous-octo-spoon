from fastapi import APIRouter, Depends
from app.api.deps import get_current_active_user, require_roles
from app.models.user import User, UserRole
from app.schemas.user import UserPublic

dev_router = APIRouter()


@dev_router.get("/me", response_model=UserPublic)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return UserPublic.model_validate(current_user)


@dev_router.get("/test/citizen")
async def test_citizen_role(current_user: User = Depends(require_roles(UserRole.CITIZEN))):
    return {"message": "Access granted for CITIZEN", "user_id": str(current_user.id), "role": current_user.role.value}


@dev_router.get("/test/student")
async def test_student_role(current_user: User = Depends(require_roles(UserRole.STUDENT))):
    return {"message": "Access granted for STUDENT", "user_id": str(current_user.id), "role": current_user.role.value}


@dev_router.get("/test/university")
async def test_university_role(current_user: User = Depends(require_roles(UserRole.UNIVERSITY))):
    return {"message": "Access granted for UNIVERSITY", "user_id": str(current_user.id), "role": current_user.role.value}


@dev_router.get("/test/industry")
async def test_industry_role(current_user: User = Depends(require_roles(UserRole.INDUSTRY))):
    return {"message": "Access granted for INDUSTRY", "user_id": str(current_user.id), "role": current_user.role.value}


@dev_router.get("/test/government")
async def test_government_role(current_user: User = Depends(require_roles(UserRole.GOVERNMENT))):
    return {"message": "Access granted for GOVERNMENT", "user_id": str(current_user.id), "role": current_user.role.value}
