from rest_framework import serializers

from .models import Service


class ServiceSerializer(serializers.ModelSerializer):
    name_of_the_expert = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = [
            "id",
            "seller",
            "service_name",
            "description",
            "price",
            "duration_of_service",
            "sample_image",
            "name_of_the_expert",
            "rating",
        ]
        read_only_fields = ["seller"]

    def get_name_of_the_expert(self, obj):
        return f"{obj.seller.first_name} {obj.seller.last_name}".strip() or obj.seller.username

    def get_rating(self, obj):
        # Demo rating for quiz scope while no dedicated review model exists.
        return 4.7
