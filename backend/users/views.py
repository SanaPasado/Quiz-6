from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import MyTokenObtainPairSerializer, RegisterSerializer, UserSerializer


User = get_user_model()


class IsAdmin(permissions.BasePermission):
	def has_permission(self, request, view):
		return bool(request.user and request.user.is_authenticated and request.user.role == User.RoleChoices.ADMIN)


class MyTokenObtainPairView(TokenObtainPairView):
	serializer_class = MyTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
	serializer_class = RegisterSerializer
	permission_classes = [permissions.AllowAny]


class UserProfileView(generics.RetrieveUpdateAPIView):
	serializer_class = UserSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_object(self):
		return self.request.user


class AdminUserListView(generics.ListAPIView):
	serializer_class = UserSerializer
	permission_classes = [IsAdmin]

	def get_queryset(self):
		return User.objects.all().order_by("id")


class AdminUserDetailView(APIView):
	permission_classes = [IsAdmin]

	def put(self, request, pk):
		user = get_object_or_404(User, pk=pk)
		serializer = UserSerializer(user, data=request.data, partial=True)
		serializer.is_valid(raise_exception=True)
		serializer.save()
		return Response(serializer.data)

	def delete(self, request, pk):
		user = get_object_or_404(User, pk=pk)
		if user.role == User.RoleChoices.ADMIN:
			return Response({"detail": "Admin account cannot be deleted."}, status=status.HTTP_400_BAD_REQUEST)
		user.delete()
		return Response(status=status.HTTP_204_NO_CONTENT)
