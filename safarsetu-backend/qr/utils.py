import io
import base64
import qrcode
from PIL import Image


def generate_qr_base64(data: str, box_size: int = 10, border: int = 2) -> str:
    """
    Generate QR code for given string data and return base64 encoded PNG data URI.
    """
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=box_size,
        border=border,
    )
    qr.add_data(data)
    qr.make(fit=True)

    img = qr.make_image(fill_color="#12355B", back_color="white")
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
    return f"data:image/png;base64,{img_str}"
