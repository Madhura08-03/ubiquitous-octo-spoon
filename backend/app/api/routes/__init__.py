from app.api.routes.auth import router as auth_router
from app.api.routes.dev_rbac import dev_router as dev_rbac_router
from app.api.routes.problems import router as problems_router
from app.api.routes.public import router as public_router
from app.api.routes.rankings import router as rankings_router
from app.api.routes.reports import router as reports_router
from app.api.routes.solutions import router as solutions_router
from app.api.routes.teams import router as teams_router

__all__ = [
    "auth_router",
    "dev_rbac_router",
    "reports_router",
    "problems_router",
    "teams_router",
    "solutions_router",
    "rankings_router",
    "public_router",
]
