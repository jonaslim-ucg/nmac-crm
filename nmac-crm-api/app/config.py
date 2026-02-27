from pathlib import Path
from typing import Optional

from pydantic_settings import BaseSettings
from tortoise import Tortoise

from app.utils.auto_routing import get_single_app_structure


class Settings(BaseSettings):
    DEBUG: bool = True
    APP_NAME: str = "NMAC CRM"

    EMAIL_HOST: str = "smtp.gmail.com"
    EMAIL_PORT: int = 587
    EMAIL_HOST_USER: str = ""
    EMAIL_HOST_PASSWORD: str = ""
    DEFAULT_FROM_EMAIL: str = ""
    SMS_API: str = ""
    TWILIO_ACCOUNT_SID: str = ""
    TWILIO_AUTH_TOKEN: str = ""

    MEDIA_DIR: str = "media/"
    MEDIA_ROOT: str = "media/"
    ENV: str = "development"
    DB_HOST: str = "localhost"
    DB_NAME: str = "db.sqlite3"
    DB_USER: str = ""
    DB_PASSWORD: str = ""
    DB_PORT: int = 5432
    DB_ENGINE: str = "postgres"

    DATABASE_URL: Optional[str] = None
    SECRET_KEY: str = ""
    REFRESH_SECRET_KEY: str = ""
    BASE_URL: str = "http://localhost:8000/"
    REDIS_URL: str = "redis://redis:6379/0"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    def model_post_init(self, __context):
        if self.DATABASE_URL:
            return

        if self.DB_ENGINE == "sqlite":
            self.DATABASE_URL = f"sqlite:///{self.DB_NAME}"
        else:
            self.DATABASE_URL = (
                f"{self.DB_ENGINE}://{self.DB_USER}:{self.DB_PASSWORD}"
                f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
            )

    class Config:
        # Load from repo root .env (nmac-crm/.env) so one file serves both API and frontend
        _root = Path(__file__).resolve().parent.parent.parent
        env_file = str(_root / ".env")
        env_file_encoding = "utf-8"
        extra = "ignore"


settings = Settings()

TORTOISE_ORM = {
    "connections": {
        "default": settings.DATABASE_URL,
    },
    "apps": get_single_app_structure("applications"),
    "use_tz": True,
    "timezone": "Asia/Dhaka",
}


async def init_db():
    await Tortoise.init(config=TORTOISE_ORM)
    if settings.ENV != "production":
        await Tortoise.generate_schemas()
    else:
        print("Skipping schema generation in production.")
