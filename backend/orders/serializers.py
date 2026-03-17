from rest_framework import serializers

from .models import Order


class OrderSerializer(serializers.ModelSerializer):
    service_name = serializers.CharField(source="service.service_name", read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "buyer",
            "service",
            "service_name",
            "paypal_transaction_id",
            "price_paid",
            "date_purchased",
        ]
        read_only_fields = ["buyer", "date_purchased", "service_name"]
