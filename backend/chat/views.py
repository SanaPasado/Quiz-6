from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from subscriptions.models import UserSubscription


class AIChatbotView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def post(self, request):
		message = str(request.data.get("message", "")).strip()
		subscription = UserSubscription.objects.filter(user=request.user, is_active=True).first()
		if not subscription:
			return Response({"detail": "Active subscription required."}, status=status.HTTP_403_FORBIDDEN)
		if subscription.usage_left <= 0:
			return Response({"detail": "No chat usages left."}, status=status.HTTP_403_FORBIDDEN)

		subscription.usage_left -= 1
		subscription.save()

		allowed_keywords = [
			"notary",
			"document",
			"affidavit",
			"certification",
			"service",
			"seller",
			"subscription",
			"order",
			"paypal",
		]
		lowered = message.lower()
		if not any(keyword in lowered for keyword in allowed_keywords):
			response_message = (
				"I can only answer questions about notary and document services on this platform, "
				"including service availability, seller applications, subscriptions, and orders."
			)
		else:
			response_message = (
				"For notary and document services, compare service descriptions, pricing, and duration on the list page, "
				"then review seller details before checkout. If needed, contact the listed expert for requirements."
			)

		return Response({"reply": response_message, "usage_left": subscription.usage_left})
