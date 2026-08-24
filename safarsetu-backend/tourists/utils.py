import random
import string


def generate_digital_tourist_id(prefix='SS-IND') -> str:
    """Generate a unique formatted Digital Tourist ID like SS-IND-8F42K9."""
    chars = string.ascii_uppercase + string.digits
    suffix = ''.join(random.choices(chars, k=6))
    return f"{prefix}-{suffix}"
