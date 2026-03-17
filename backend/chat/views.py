import json
from urllib.error import URLError
from urllib.request import Request, urlopen

from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from subscriptions.models import UserSubscription


User = get_user_model()


class IsAdmin(permissions.BasePermission):
	def has_permission(self, request, view):
		return bool(request.user and request.user.is_authenticated and request.user.role == User.RoleChoices.ADMIN)


class AIChatbotView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	@staticmethod
	def _fallback_reply(message):
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
			return (
				"I can only answer questions about notary and document services on this platform, "
				"including service availability, seller applications, subscriptions, and orders."
			)
		return (
			"For notary and document services, compare service descriptions, pricing, and duration on the list page, "
			"then review seller details before checkout. If needed, contact the listed expert for requirements."
		)

	@staticmethod
	def _ask_gemini(message):
		if not settings.GEMINI_API_KEY:
			return None

		endpoint = (
			"https://generativelanguage.googleapis.com/v1beta/models/"
			f"{settings.GEMINI_MODEL}:generateContent?key={settings.GEMINI_API_KEY}"
		)

		payload = {
			"contents": [
				{
					"parts": [
						{
							"text": (
								"You are the AI assistant for a notary/document services marketplace. "
								"Only answer topics related to: notary/document services, service listings, "
								"seller applications, subscriptions, chatbot usage, and orders/payments on this platform. "
								"If out-of-scope, politely refuse in one sentence. "
								"Keep answers concise and practical.\n\n"
								f"User message: {message}"
							)
						}
					]
				}
			],
			"generationConfig": {
				"temperature": 0.4,
				"maxOutputTokens": 220,
			},
		}

		request = Request(
			endpoint,
			data=json.dumps(payload).encode("utf-8"),
			headers={"Content-Type": "application/json"},
			method="POST",
		)

		try:
			with urlopen(request, timeout=20) as response:
				body = json.loads(response.read().decode("utf-8"))
		except (URLError, TimeoutError, json.JSONDecodeError):
			return None

		candidates = body.get("candidates") or []
		if not candidates:
			return None

		content = candidates[0].get("content") or {}
		parts = content.get("parts") or []
		if not parts:
			return None

		text = parts[0].get("text", "").strip()
		return text or None

	def post(self, request):
		message = str(request.data.get("message", "")).strip()
		if not message:
			return Response({"detail": "Message is required."}, status=status.HTTP_400_BAD_REQUEST)

		subscription = UserSubscription.objects.filter(user=request.user, is_active=True).first()
		if not subscription:
			return Response({"detail": "Active subscription required."}, status=status.HTTP_403_FORBIDDEN)
		if subscription.usage_left <= 0:
			return Response({"detail": "No chat usages left."}, status=status.HTTP_403_FORBIDDEN)

		response_message = self._ask_gemini(message) or self._fallback_reply(message)

		subscription.usage_left -= 1
		subscription.save(update_fields=["usage_left"])

		return Response({"reply": response_message, "usage_left": subscription.usage_left})


class GeminiHealthCheckView(APIView):
	permission_classes = [IsAdmin]

	def get(self, request):
		if not settings.GEMINI_API_KEY:
			return Response(
				{"ok": False, "detail": "GEMINI_API_KEY is not configured.", "model": settings.GEMINI_MODEL},
				status=status.HTTP_503_SERVICE_UNAVAILABLE,
			)

		reply = AIChatbotView._ask_gemini("Reply with only: Gemini connection OK")
		if not reply:
			return Response(
				{"ok": False, "detail": "Gemini request failed.", "model": settings.GEMINI_MODEL},
				status=status.HTTP_502_BAD_GATEWAY,
			)

		return Response(
			{
				"ok": True,
				"model": settings.GEMINI_MODEL,
				"reply_preview": reply[:120],
			}
		)
