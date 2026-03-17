from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import SubscriptionTier, UserSubscription
from .serializers import SubscriptionTierSerializer, UserSubscriptionSerializer


User = get_user_model()


class IsAdmin(permissions.BasePermission):
	def has_permission(self, request, view):
		return bool(request.user and request.user.is_authenticated and request.user.role == User.RoleChoices.ADMIN)


class TierListView(generics.ListAPIView):
	queryset = SubscriptionTier.objects.all().order_by("id")
	serializer_class = SubscriptionTierSerializer
	permission_classes = [permissions.AllowAny]


class SubscribeView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def post(self, request):
		tier_id = request.data.get("tier_id")
		tier = generics.get_object_or_404(SubscriptionTier, id=tier_id)
		subscription, _ = UserSubscription.objects.get_or_create(user=request.user, defaults={"tier": tier, "usage_left": tier.max_usage})
		subscription.tier = tier
		subscription.usage_left = tier.max_usage
		subscription.is_active = True
		subscription.save()
		return Response(UserSubscriptionSerializer(subscription).data, status=status.HTTP_200_OK)


class MySubscriptionView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def get(self, request):
		subscription = UserSubscription.objects.filter(user=request.user).first()
		if not subscription:
			return Response({"detail": "No subscription found."}, status=status.HTTP_404_NOT_FOUND)
		return Response(UserSubscriptionSerializer(subscription).data)


class SubscriptionListView(generics.ListAPIView):
	serializer_class = UserSubscriptionSerializer
	permission_classes = [IsAdmin]
	queryset = UserSubscription.objects.select_related("user", "tier").all().order_by("-subscribed_at")


class ConsumeUsageView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def post(self, request):
		subscription = UserSubscription.objects.filter(user=request.user, is_active=True).first()
		if not subscription:
			return Response({"detail": "No active subscription."}, status=status.HTTP_403_FORBIDDEN)
		if subscription.usage_left < 1:
			return Response({"detail": "Usage limit reached."}, status=status.HTTP_403_FORBIDDEN)
		subscription.usage_left -= 1
		subscription.save()
		return Response({"usage_left": subscription.usage_left})
