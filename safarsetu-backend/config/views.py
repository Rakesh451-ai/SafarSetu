from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema


@extend_schema(
    summary="Health Check",
    description="Check backend server health status and availability.",
    responses={200: dict}
)
@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """
    Public health check endpoint.
    Returns:
        {
            "status": "ok",
            "service": "safarsetu-backend"
        }
    """
    return Response({
        "status": "ok",
        "service": "safarsetu-backend"
    })
