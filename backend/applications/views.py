from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import SellerApplication
from .serializers import SellerApplicationSerializer


User = get_user_model()


class IsAdmin(permissions.BasePermission):
	def has_permission(self, request, view):
		return bool(request.user and request.user.is_authenticated and request.user.role == User.RoleChoices.ADMIN)


class SubmitApplicationView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def post(self, request):
		application, _ = SellerApplication.objects.get_or_create(user=request.user)
		application.status = "Pending"
		application.decline_reason = ""
		application.save()
		return Response(SellerApplicationSerializer(application).data)


class ListApplicationView(generics.ListAPIView):
	serializer_class = SellerApplicationSerializer
	permission_classes = [IsAdmin]

	def get_queryset(self):
		return SellerApplication.objects.select_related("user").all().order_by("-created_at")


class ApproveApplicationView(APIView):
	permission_classes = [IsAdmin]

	def post(self, request, pk):
		merchant_id = request.data.get("merchant_id", "").strip()
		application = get_object_or_404(SellerApplication, pk=pk)
		user = application.user
		user.role = User.RoleChoices.SELLER
		user.merchant_id = merchant_id or user.merchant_id
		user.save()
		application.status = "Approved"
		application.decline_reason = ""
		application.save()
		return Response(SellerApplicationSerializer(application).data)


class DeclineApplicationView(APIView):
	permission_classes = [IsAdmin]

	def post(self, request, pk):
		reason = request.data.get("decline_reason", "").strip()
		application = get_object_or_404(SellerApplication, pk=pk)
		application.status = "Declined"
		application.decline_reason = reason or "Application did not meet review criteria."
		application.save()
		return Response(SellerApplicationSerializer(application).data)
