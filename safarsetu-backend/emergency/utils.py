import random
from datetime import datetime


def generate_incident_id() -> str:
    """Generates unique incident ID formatted like INC-2026-089."""
    year = datetime.now().year
    num = random.randint(100, 999)
    return f"INC-{year}-{num}"
