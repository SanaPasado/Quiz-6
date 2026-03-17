from django.contrib import admin

from .models import SubscriptionTier, UserSubscription


@admin.register(SubscriptionTier)
class SubscriptionTierAdmin(admin.ModelAdmin):
	list_display = ("id", "name", "price", "max_usage", "paypal_plan_id")
	search_fields = ("name", "paypal_plan_id")


@admin.register(UserSubscription)
class UserSubscriptionAdmin(admin.ModelAdmin):
	list_display = ("id", "user", "tier", "usage_left", "is_active", "paypal_subscription_id", "subscribed_at")
	list_filter = ("is_active", "tier")
	search_fields = ("user__email", "paypal_subscription_id")
