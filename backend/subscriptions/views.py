import base64
import json
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from django.conf import settings
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

	@staticmethod
	def _get_paypal_access_token():
		if not settings.PAYPAL_CLIENT_ID or not settings.PAYPAL_CLIENT_SECRET:
			return None

		token_url = f"{settings.PAYPAL_BASE_URL}/v1/oauth2/token"
		credentials = f"{settings.PAYPAL_CLIENT_ID}:{settings.PAYPAL_CLIENT_SECRET}".encode("utf-8")
		basic_auth = base64.b64encode(credentials).decode("utf-8")
		payload = urlencode({"grant_type": "client_credentials"}).encode("utf-8")

		request = Request(
			token_url,
			data=payload,
			headers={
				"Authorization": f"Basic {basic_auth}",
				"Content-Type": "application/x-www-form-urlencoded",
			},
			method="POST",
		)

		try:
			with urlopen(request, timeout=20) as response:
				data = json.loads(response.read().decode("utf-8"))
		except (HTTPError, URLError, json.JSONDecodeError, TimeoutError):
			return None

		return data.get("access_token")

	@staticmethod
	def _get_paypal_subscription(paypal_subscription_id, access_token):
		subscription_url = f"{settings.PAYPAL_BASE_URL}/v1/billing/subscriptions/{paypal_subscription_id}"
		request = Request(
			subscription_url,
			headers={
				"Authorization": f"Bearer {access_token}",
				"Content-Type": "application/json",
			},
			method="GET",
		)

		try:
			with urlopen(request, timeout=20) as response:
				return json.loads(response.read().decode("utf-8"))
		except (HTTPError, URLError, json.JSONDecodeError, TimeoutError):
			return None

	def post(self, request):
		tier_id = request.data.get("tier_id")
		paypal_subscription_id = str(request.data.get("paypal_subscription_id", "")).strip()

		if not paypal_subscription_id:
			return Response({"detail": "PayPal subscription ID is required."}, status=status.HTTP_400_BAD_REQUEST)

		tier = generics.get_object_or_404(SubscriptionTier, id=tier_id)
		if not tier.paypal_plan_id:
			return Response(
				{"detail": "This tier is not yet mapped to a PayPal plan."},
				status=status.HTTP_400_BAD_REQUEST,
			)

		access_token = self._get_paypal_access_token()
		if not access_token:
			return Response({"detail": "Unable to authenticate with PayPal."}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

		paypal_subscription = self._get_paypal_subscription(paypal_subscription_id, access_token)
		if not paypal_subscription:
			return Response({"detail": "Unable to verify PayPal subscription."}, status=status.HTTP_502_BAD_GATEWAY)

		paypal_plan_id = paypal_subscription.get("plan_id")
		paypal_status = paypal_subscription.get("status")

		if paypal_plan_id != tier.paypal_plan_id:
			return Response(
				{"detail": "PayPal plan does not match selected tier."},
				status=status.HTTP_400_BAD_REQUEST,
			)

		if paypal_status not in {"ACTIVE", "APPROVAL_PENDING"}:
			return Response(
				{"detail": f"PayPal subscription status is {paypal_status or 'UNKNOWN'}."},
				status=status.HTTP_400_BAD_REQUEST,
			)

		subscription, _ = UserSubscription.objects.get_or_create(user=request.user, defaults={"tier": tier, "usage_left": tier.max_usage})
		subscription.tier = tier
		subscription.usage_left = tier.max_usage
		subscription.is_active = True
		subscription.paypal_subscription_id = paypal_subscription_id
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
