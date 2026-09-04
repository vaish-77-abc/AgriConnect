import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    """Application configuration settings."""

    APP_NAME: str = "AgriConnect"
    APP_VERSION: str = "1.0.0"
    APP_DESCRIPTION: str = "Agricultural Employment Platform - Connecting Farmers and Workers"

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./agriconnect.db")

    # JWT Authentication
    SECRET_KEY: str = os.getenv("SECRET_KEY", "agriconnect-super-secret-key-change-in-production-2024")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))  # 24 hours

    # CORS
    CORS_ORIGINS: list = [
        "http://localhost:5173",   # Vite dev server
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]

    # File uploads
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "uploads")
    MAX_FILE_SIZE: int = 5 * 1024 * 1024  # 5 MB


settings = Settings()
