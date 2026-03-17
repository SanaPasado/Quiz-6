from django.urls import path

from .views import ConsumeUsageView, MySubscriptionView, SubscribeView, SubscriptionListView, TierListView

urlpatterns = [
    path("tiers/", TierListView.as_view(), name="tier-list"),
    path("subscribe/", SubscribeView.as_view(), name="subscribe"),
    path("mine/", MySubscriptionView.as_view(), name="my-subscription"),
    path("admin/list/", SubscriptionListView.as_view(), name="subscription-admin-list"),
    path("consume/", ConsumeUsageView.as_view(), name="consume-usage"),
]
