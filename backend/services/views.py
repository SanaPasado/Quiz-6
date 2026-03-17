from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions

from .models import Service
from .serializers import ServiceSerializer


User = get_user_model()


class IsSeller(permissions.BasePermission):
	def has_permission(self, request, view):
		return bool(request.user and request.user.is_authenticated and request.user.role == User.RoleChoices.SELLER)


class ServiceListView(generics.ListAPIView):
	queryset = Service.objects.select_related("seller").all().order_by("id")
	serializer_class = ServiceSerializer
	permission_classes = [permissions.AllowAny]


class ServiceDetailView(generics.RetrieveAPIView):
	queryset = Service.objects.select_related("seller").all()
	serializer_class = ServiceSerializer
	permission_classes = [permissions.AllowAny]


class SellerServiceManageView(generics.ListCreateAPIView):
	serializer_class = ServiceSerializer
	permission_classes = [IsSeller]

	def get_queryset(self):
		return Service.objects.filter(seller=self.request.user).order_by("id")

	def perform_create(self, serializer):
		serializer.save(seller=self.request.user)


class SellerServiceDetailView(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = ServiceSerializer
	permission_classes = [IsSeller]

	def get_object(self):
		service = get_object_or_404(Service, pk=self.kwargs["pk"])
		self.check_object_permissions(self.request, service)
		if service.seller_id != self.request.user.id:
			raise permissions.PermissionDenied("You can only manage your own services.")
		return service
