from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from ..serializers import RegisterSerializer
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password


class RegisterView(APIView):
    permission_classes = [AllowAny]  # ✅ Allow access without authentication

    def post(self, request):
        print("📥 Registration data:", request.data)
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            print("✅ User registered successfully")
            return Response({"message": "User registered successfully"}, status=201)
        
        print("❌ Registration errors:", serializer.errors)
        return Response(serializer.errors, status=400)




class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response({"error": "Username and password required."}, status=400)

        # ✅ IMPORTANT: Pass request explicitly
        user = authenticate(request=request, username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user_id": user.id,
                "username": user.username,
                "email": user.email,
            })
        else:
            return Response({"error": "Invalid credentials"}, status=401)
class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        new_password = request.data.get('newPassword')
        confirm_password = request.data.get('confirmPassword')

        # Validate fields
        if not all([email, new_password, confirm_password]):
            return Response({'message': 'All fields are required.'}, status=status.HTTP_400_BAD_REQUEST)

        if new_password != confirm_password:
            return Response({'message': 'Passwords do not match.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
            user.password = make_password(new_password)
            user.save()
            return Response({'message': 'Password updated successfully.'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'message': 'User with this email does not exist.'}, status=status.HTTP_404_NOT_FOUND)
