from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import auth_router
from app.api.query import router as query_router
from app.core.config import get_settings
from app.database.connection import init_db


@asynccontextmanager
async def lifespan(_app: FastAPI):
    """Application startup and shutdown events."""

    # ✅ ENABLE THIS
    await init_db()

    yield


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title=settings.app_name,
        lifespan=lifespan
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(auth_router)
    app.include_router(query_router)

    @app.get("/health")
    async def health():
        return {"status": "ok"}

    return app


app = create_app()
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)