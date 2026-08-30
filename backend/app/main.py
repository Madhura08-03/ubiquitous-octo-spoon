from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.auth import router as auth_router
from app.api.routes.dev_rbac import dev_router as dev_rbac_router
from app.api.routes.problems import router as problems_router
from app.api.routes.public import router as public_router
from app.api.routes.rankings import router as rankings_router
from app.api.routes.reports import router as reports_router
from app.api.routes.solutions import router as solutions_router
from app.api.routes.teams import router as teams_router
from app.core.config import get_settings
from app.core.exceptions import register_exception_handlers

settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Exception handlers
register_exception_handlers(app)


# Health Check
@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "ok",
        "service": "samanvay-api",
        "version": settings.APP_VERSION,
    }


# Routers
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(dev_rbac_router, prefix="/auth", tags=["Dev RBAC Tests"])
app.include_router(reports_router, prefix="/reports", tags=["Citizen Reports"])
app.include_router(problems_router, prefix="/problems", tags=["Student Problem Feed"])
app.include_router(teams_router, prefix="/teams", tags=["Teams & Mentor Adoption"])
app.include_router(solutions_router, prefix="/solutions", tags=["Solutions & Industry Review"])
app.include_router(rankings_router, prefix="/rankings", tags=["Leaderboards & Rankings"])
app.include_router(public_router, prefix="/public", tags=["Public APIs & Analytics"])
