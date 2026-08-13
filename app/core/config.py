"""Application settings loaded from environment variables."""

from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime configuration for the FastAPI application."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    # 🔹 App settings
    app_name: str = "AI-Powered Intelligent Query Resolution System"
    debug: bool = True   # change to False in production

    # 🔥 FIXED DATABASE (SQLite instead of PostgreSQL)
    database_url: str = "sqlite+aiosqlite:///./test.db"

    # 🔐 JWT settings
    jwt_secret_key: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7

    # 🍪 Cookie settings
    cookie_secure: bool = False
    cookie_samesite: str = "lax"
    access_cookie_name: str = "access_token"
    refresh_cookie_name: str = "refresh_token"

    # 🌐 CORS settings
    cors_origins: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000"
    ]


@lru_cache
def get_settings() -> Settings:
    """Return a cached Settings instance."""
    return Settings()