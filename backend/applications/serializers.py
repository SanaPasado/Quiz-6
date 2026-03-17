from rest_framework import serializers

from .models import SellerApplication


class SellerApplicationSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source="user.email", read_only=True)
    first_name = serializers.CharField(source="user.first_name", read_only=True)
    last_name = serializers.CharField(source="user.last_name", read_only=True)

    class Meta:
        model = SellerApplication
        fields = [
            "id",
            "user",
            "user_email",
            "first_name",
            "last_name",
            "status",
            "decline_reason",
            "created_at",
        ]
        read_only_fields = ["status", "decline_reason", "created_at", "user"]
