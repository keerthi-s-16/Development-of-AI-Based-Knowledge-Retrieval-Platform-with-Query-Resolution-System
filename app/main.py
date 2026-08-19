from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import auth_router
from app.api.query import router as query_router
from app.api.upload import router as upload_router
from app.core.config import get_settings
from app.database.connection import init_db


# 🔥 Startup / Shutdown lifecycle
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting application...")

    # DB initialize
    await init_db()
    print("Database initialized")

    yield

    print("Shutting down application...")


# 🔥 Create FastAPI app
def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title=settings.app_name,
        lifespan=lifespan
    )

    # 🔥 CORS setup
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # 🔥 Routers
    app.include_router(auth_router)
    app.include_router(query_router)
    app.include_router(upload_router)   # ✅ IMPORTANT FIX

    # 🔥 ROOT route
    @app.get("/")
    async def root():
        return {
            "message": "AI Query System is running 🚀"
        }

    # 🔥 Health check route
    @app.get("/health")
    async def health():
        return {"status": "ok"}

    return app


# 🔥 App instance
app = create_app()