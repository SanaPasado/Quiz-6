from django.urls import path

from .views import AIChatbotView, GeminiHealthCheckView

urlpatterns = [
    path("ask/", AIChatbotView.as_view(), name="chat-ask"),
    path("health/gemini/", GeminiHealthCheckView.as_view(), name="chat-gemini-health"),
]
