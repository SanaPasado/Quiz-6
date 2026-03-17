from rest_framework import serializers

from .models import SubscriptionTier, UserSubscription


class SubscriptionTierSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionTier
        fields = ["id", "name", "price", "max_usage"]


class UserSubscriptionSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source="user.email", read_only=True)
    tier = serializers.CharField(source="tier.name", read_only=True)
    subscription_date = serializers.DateTimeField(source="subscribed_at", read_only=True)

    class Meta:
        model = UserSubscription
        fields = ["id", "user", "tier", "usage_left", "is_active", "subscription_date"]
