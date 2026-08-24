import logging
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import APIException, ValidationError

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """
    Custom DRF exception handler returning standardized error responses:
    {
        "success": false,
        "message": "Human readable error description",
        "errors": { ... }
    }
    """
    # Call REST framework's default exception handler first to get standard error response.
    response = exception_handler(exc, context)

    if response is not None:
        message = "An error occurred."
        errors = {}

        if isinstance(exc, ValidationError):
            message = "Validation error."
            if isinstance(response.data, dict):
                # Extract first error message for top-level message if available
                first_key = next(iter(response.data), None)
                if first_key and isinstance(response.data[first_key], list) and len(response.data[first_key]) > 0:
                    message = str(response.data[first_key][0])
                errors = response.data
            elif isinstance(response.data, list):
                message = str(response.data[0]) if response.data else "Validation error."
                errors = {"non_field_errors": response.data}
        elif isinstance(response.data, dict):
            if 'detail' in response.data:
                message = str(response.data['detail'])
                errors = {"detail": response.data['detail']}
            else:
                errors = response.data
        elif isinstance(response.data, list):
            message = str(response.data[0]) if response.data else "An error occurred."
            errors = {"detail": response.data}

        custom_data = {
            "success": False,
            "message": message,
            "errors": errors,
        }
        response.data = custom_data
        return response

    # Unhandled server exception (500)
    logger.exception(f"Unhandled Server Error: {exc}", exc_info=exc)
    return Response(
        {
            "success": False,
            "message": "An unexpected server error occurred. Please try again later.",
            "errors": {}
        },
        status=status.HTTP_500_INTERNAL_SERVER_ERROR
    )
