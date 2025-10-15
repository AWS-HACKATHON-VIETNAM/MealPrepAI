from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from ..serializers import UserRegistrationSerializer, UserProfileSerializer
from ..models import UserProfile


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    """Register a new user"""
    serializer = UserRegistrationSerializer(data=request.data)
    print("="*60)
    print("REGISTRATION DATA RECEIVED:", request.data)
    print("="*60)
    
    if serializer.is_valid():
        try:
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    "message": "User registered successfully",
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                },
                status=status.HTTP_201_CREATED,
            )
        except Exception as e:
            return Response(
                {"error": f"Failed to create user: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    print("="*60)
    print("VALIDATION ERRORS:", serializer.errors)
    print("="*60)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    """Login user and return JWT tokens"""
    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response(
            {"error": "Email and password are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = authenticate(request, username=email, password=password)

    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response(
            {"access": str(refresh.access_token), "refresh": str(refresh)},
            status=status.HTTP_200_OK,
        )
    else:
        return Response(
            {"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_profile(request):
    """Get user profile"""
    try:
        profile = request.user.profile
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except UserProfile.DoesNotExist:
        return Response(
            {"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND
        )

# @api_view(['GET', 'PUT']) # Allow both methods
# @permission_classes([IsAuthenticated])
# def get_profile(request):
#     """
#     Handles retrieving the full profile (GET) and 
#     updating user details like name (PUT).
#     """
#     if request.method == 'GET':
#         try:
#             # Use UserProfileSerializer to get combined data
#             profile = request.user.profile
#             serializer = UserProfileSerializer(profile)
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         except UserProfile.DoesNotExist:
#             return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

#     elif request.method == 'PUT':
#         # Use UserSerializer to update User model fields
#         user = request.user
#         serializer = UserRegistrationSerializer(user, data=request.data, partial=True)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """Update user profile"""
    try:
        profile = request.user.profile
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except UserProfile.DoesNotExist:
        return Response(
            {"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND
        )
