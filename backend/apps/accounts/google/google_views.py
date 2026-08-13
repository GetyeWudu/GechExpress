
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from ..views import build_auth_response
from .google_serializers import GoogleLoginSerializer
from ..services import (
    authenticate_with_google, 
    GoogleAuthenticationError,
    GoogleEmailConflictError,
)

    
class GoogleLoginView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        # 1. Validate the incoming Google credential
        serializer = GoogleLoginSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        credential = (
            serializer.validated_data[
                "credential"
            ]
        )

        # 2. Authenticate the Google user
        try:
            user = authenticate_with_google(
                credential
            )

        except GoogleEmailConflictError as exc:
            return Response(
                {
                    "detail": str(exc)
                },
                status=status.HTTP_409_CONFLICT,
            )

        except GoogleAuthenticationError as exc:
            return Response(
                {
                    "detail": str(exc)
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 3. Generate GechExpress JWT tokens
        return Response(
            build_auth_response(user),
            status=status.HTTP_200_OK,
        )
