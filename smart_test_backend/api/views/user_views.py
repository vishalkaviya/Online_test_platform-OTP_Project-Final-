from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .auth_views import Response
from ..serializers import UserProfileSerializer, UserSerializer,UserWithProfileSerializer
from django.contrib.auth.models import User





class EditProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        try:
            profile = request.user.userprofile
        except UserProfile.DoesNotExist:
            profile, _ = UserProfile.objects.get_or_create(user=request.user)

        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Profile updated successfully"})
        return Response(serializer.errors, status=400)



class ViewProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        from ..models import UserProfile
        profile, _ = UserProfile.objects.get_or_create(user=user)

        response_data = {
            "username": user.username,
            "email": user.email,
            "first_name": profile.first_name,
            "last_name": profile.last_name,
            "mobile": profile.mobile,
            "gender": profile.gender,
            "dob": profile.dob,
            "image": profile.image.url if profile.image else None
        }
        return Response(response_data)
class AllUsersView(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserWithProfileSerializer(users, many=True)
        return Response(serializer.data)