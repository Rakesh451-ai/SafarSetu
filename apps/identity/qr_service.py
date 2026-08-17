import base64
import hashlib
import io
from datetime import datetime, time, timedelta
from typing import Any, Dict, Optional, Tuple

import jwt
import qrcode
from django.conf import settings
from django.utils import timezone
from qrcode.constants import ERROR_CORRECT_M

from .models import DigitalID, Tourist


def calculate_checksum(
    tourist_id: str,
    name: str,
    nationality: str,
    phone: str,
    iat_ts: int,
    exp_ts: int,
) -> str:
    """
    Computes a cryptographic SHA-256 integrity checksum over the tourist identity payload.
    """
    salt = getattr(settings, "SECRET_KEY", "safarsetu-secret")
    raw_data = f"{tourist_id}:{name}:{nationality}:{phone}:{iat_ts}:{exp_ts}:{salt}"
    return hashlib.sha256(raw_data.encode("utf-8")).hexdigest()[:16]


def generate_signed_jwt_payload(
    tourist: Tourist,
    issued_at: Optional[datetime] = None,
    expires_at: Optional[datetime] = None,
) -> Tuple[str, Dict[str, Any], datetime, datetime]:
    """
    Generates a cryptographically signed PyJWT token payload containing
    tourist identity details, issuance/expiry timestamps, and integrity checksum.
    """
    if issued_at is None:
        issued_at = timezone.now()

    if expires_at is None:
        # Default expiry: end of trip (23:59:59) + 1 grace day, or 30 days from now
        if tourist.trip_end:
            trip_end_dt = datetime.combine(tourist.trip_end, time(23, 59, 59))
            trip_end_aware = timezone.make_aware(
                trip_end_dt, timezone.get_current_timezone()
            )
            expires_at = trip_end_aware + timedelta(days=1)
        else:
            expires_at = issued_at + timedelta(days=30)

    iat_ts = int(issued_at.timestamp())
    exp_ts = int(expires_at.timestamp())

    checksum = calculate_checksum(
        tourist_id=str(tourist.tourist_id),
        name=tourist.name,
        nationality=tourist.nationality,
        phone=tourist.phone,
        iat_ts=iat_ts,
        exp_ts=exp_ts,
    )

    payload: Dict[str, Any] = {
        "iss": "safarsetu.identity.v1",
        "sub": "digital_tourist_id",
        "tourist_id": str(tourist.tourist_id),
        "name": tourist.name,
        "nationality": tourist.nationality,
        "id_proof_type": tourist.id_proof_type,
        "phone": tourist.phone,
        "preferred_language": tourist.preferred_language,
        "trip_start": tourist.trip_start.isoformat() if tourist.trip_start else None,
        "trip_end": tourist.trip_end.isoformat() if tourist.trip_end else None,
        "iat": iat_ts,
        "exp": exp_ts,
        "checksum": checksum,
    }

    signed_token = jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm="HS256",
    )

    return signed_token, payload, issued_at, expires_at


def generate_qr_png_bytes(data: str) -> bytes:
    """
    Renders data as a high-contrast QR code image returned as PNG bytes.
    """
    qr = qrcode.QRCode(
        version=None,
        error_correction=ERROR_CORRECT_M,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    return buffer.getvalue()


def generate_qr_base64(data: str) -> str:
    """
    Renders QR code as base64-encoded PNG image data URI string.
    """
    png_bytes = generate_qr_png_bytes(data)
    b64_encoded = base64.b64encode(png_bytes).decode("utf-8")
    return f"data:image/png;base64,{b64_encoded}"


def create_or_rotate_digital_id(
    tourist: Tourist,
    expires_at: Optional[datetime] = None,
) -> DigitalID:
    """
    Creates a new DigitalID or updates the active DigitalID for a tourist
    with a newly signed PyJWT token and cached QR code image.
    """
    issued_at = timezone.now()
    signed_token, payload, issued_at, expires_at = generate_signed_jwt_payload(
        tourist=tourist,
        issued_at=issued_at,
        expires_at=expires_at,
    )
    qr_b64 = generate_qr_base64(signed_token)

    # Deactivate existing active digital IDs for this tourist
    DigitalID.objects.filter(tourist=tourist, is_active=True).update(is_active=False)

    digital_id = DigitalID.objects.create(
        tourist=tourist,
        qr_payload_signed=signed_token,
        qr_image_base64=qr_b64,
        issued_at=issued_at,
        expires_at=expires_at,
        is_active=True,
    )
    return digital_id


def verify_qr_token(signed_token: str) -> Dict[str, Any]:
    """
    Validates the signed JWT token and verifies its checksum and expiration.
    """
    try:
        decoded = jwt.decode(
            signed_token,
            settings.SECRET_KEY,
            algorithms=["HS256"],
            options={"require": ["exp", "iat", "tourist_id", "checksum"]},
        )
    except jwt.ExpiredSignatureError:
        raise ValueError("Digital ID QR token has expired.")
    except jwt.InvalidTokenError as exc:
        raise ValueError(f"Invalid Digital ID token: {exc}")

    # Verify checksum
    expected_checksum = calculate_checksum(
        tourist_id=decoded["tourist_id"],
        name=decoded.get("name", ""),
        nationality=decoded.get("nationality", ""),
        phone=decoded.get("phone", ""),
        iat_ts=decoded["iat"],
        exp_ts=decoded["exp"],
    )
    if decoded["checksum"] != expected_checksum:
        raise ValueError("Digital ID token checksum mismatch / integrity compromised.")

    return decoded
