from fastapi import Depends, HTTPException, status, Request, Header
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError, ExpiredSignatureError
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
from tortoise.exceptions import DoesNotExist, OperationalError
from tortoise import connections
import asyncio
from app.config import settings

from applications.user.models import User

# =========================
# JWT SETTINGS
# =========================
SECRET_KEY = settings.SECRET_KEY
REFRESH_SECRET_KEY = settings.REFRESH_SECRET_KEY
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES
REFRESH_TOKEN_EXPIRE_DAYS = settings.REFRESH_TOKEN_EXPIRE_DAYS

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login_auth2")
DB_MAX_RETRIES = 3


async def safe_get_user_by_id(user_id: str):
    for attempt in range(1, DB_MAX_RETRIES + 1):
        try:
            return await User.get(id=user_id)
        except OperationalError as e:
            err = str(e)
            is_transient = ("Packet sequence number wrong" in err) or ("Lost connection" in err)
            if not is_transient or attempt == DB_MAX_RETRIES:
                raise
            await connections.close_all(discard=True)
            await asyncio.sleep(0.2 * attempt)


# =========================
# TOKEN HELPERS
# =========================
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, REFRESH_SECRET_KEY, algorithm=ALGORITHM)


# =========================
# AUTH HELPERS
# =========================
async def get_current_user(
        request: Request,
        token: str = Depends(oauth2_scheme),
        refresh_token: str = Header(default=None, alias="refresh-token")
) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

    except ExpiredSignatureError:
        if not refresh_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Access token expired. Refresh token required.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        try:
            refresh_payload = jwt.decode(refresh_token, REFRESH_SECRET_KEY, algorithms=[ALGORITHM])

            token_data = {
                "sub": refresh_payload.get("sub"),
                "role": refresh_payload.get("role"),
                "is_active": refresh_payload.get("is_active"),
                "is_staff": refresh_payload.get("is_staff"),
                "is_superuser": refresh_payload.get("is_superuser"),
            }

            new_access_token = create_access_token(token_data)
            new_refresh_token = create_refresh_token(token_data)

            request.state.new_tokens = {
                "access_token": new_access_token,
                "refresh_token": new_refresh_token,
            }

            payload = jwt.decode(new_access_token, SECRET_KEY, algorithms=[ALGORITHM])

        except ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token expired. Please log in again.",
            )
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
            )

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid access token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        user = await safe_get_user_by_id(payload.get("sub"))
    except DoesNotExist:
        raise HTTPException(status_code=401, detail="User not found")
    except OperationalError:
        raise HTTPException(status_code=503, detail="Database unavailable, please retry")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Inactive user")

    return user
