from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from services.models import Service
from subscriptions.models import SubscriptionTier


OG_USERS = [
    {
        "email": "admin@notaryhub.local",
        "username": "admin_master",
        "phone_number": "09170000001",
        "first_name": "Ariana",
        "last_name": "Lopez",
        "location": "Makati City",
        "gender": "Female",
        "role": "Admin",
        "password": "Admin1234!",
        "merchant_id": "",
    },
    {
        "email": "user@notaryhub.local",
        "username": "regular_user",
        "phone_number": "09170000002",
        "first_name": "Miguel",
        "last_name": "Dizon",
        "location": "Quezon City",
        "gender": "Male",
        "role": "User",
        "password": "User12345!",
        "merchant_id": "",
    },
    {
        "email": "seller@notaryhub.local",
        "username": "trusted_seller",
        "phone_number": "09170000003",
        "first_name": "Carla",
        "last_name": "Reyes",
        "location": "Cebu City",
        "gender": "Female",
        "role": "Seller",
        "password": "Seller123!",
        "merchant_id": "MRC-SELLER-1003",
    },
]

OG_SERVICES = [
    {
        "seller_email": "seller@notaryhub.local",
        "service_name": "Affidavit Drafting Assistance",
        "description": "Guided drafting for affidavit templates with review-ready formatting.",
        "price": Decimal("650.00"),
        "duration_of_service": "1 to 2 business days",
        "sample_image": "https://picsum.photos/seed/affidavit/900/600",
    },
    {
        "seller_email": "seller@notaryhub.local",
        "service_name": "Document Notarization Booking",
        "description": "Schedule a notarization session for contracts and sworn declarations.",
        "price": Decimal("500.00"),
        "duration_of_service": "Same day appointment",
        "sample_image": "https://picsum.photos/seed/notarization/900/600",
    },
    {
        "seller_email": "seller@notaryhub.local",
        "service_name": "Certified True Copy Processing",
        "description": "Assistance in preparing and organizing files for certified true copy requests.",
        "price": Decimal("420.00"),
        "duration_of_service": "24 hours",
        "sample_image": "https://picsum.photos/seed/certified-copy/900/600",
    },
]

OG_TIERS = [
    {"name": "Tier 1", "price": Decimal("150.00"), "max_usage": 3},
    {"name": "Tier 2", "price": Decimal("300.00"), "max_usage": 5},
    {"name": "Tier 3", "price": Decimal("450.00"), "max_usage": 10},
]


class Command(BaseCommand):
    help = "Seed OG users, services, and subscription tiers for local development."

    def add_arguments(self, parser):
        parser.add_argument(
            "--reset-passwords",
            action="store_true",
            help="Reset passwords for existing OG users as well.",
        )

    def handle(self, *args, **options):
        reset_passwords = options["reset_passwords"]
        user_model = get_user_model()

        created_users = 0
        updated_users = 0

        for user_data in OG_USERS:
            defaults = {
                "username": user_data["username"],
                "phone_number": user_data["phone_number"],
                "first_name": user_data["first_name"],
                "last_name": user_data["last_name"],
                "location": user_data["location"],
                "gender": user_data["gender"],
                "role": user_data["role"],
                "merchant_id": user_data["merchant_id"] or None,
            }

            user, created = user_model.objects.update_or_create(
                email=user_data["email"],
                defaults=defaults,
            )

            if created or reset_passwords:
                user.set_password(user_data["password"])
                user.save(update_fields=["password"])

            if created:
                created_users += 1
            else:
                updated_users += 1

        created_services = 0
        updated_services = 0

        for service_data in OG_SERVICES:
            seller = user_model.objects.filter(email=service_data["seller_email"]).first()
            if not seller:
                self.stdout.write(self.style.WARNING(f"Skipping service; seller not found: {service_data['seller_email']}"))
                continue

            defaults = {
                "description": service_data["description"],
                "price": service_data["price"],
                "duration_of_service": service_data["duration_of_service"],
                "sample_image": service_data["sample_image"],
            }

            _, created = Service.objects.update_or_create(
                seller=seller,
                service_name=service_data["service_name"],
                defaults=defaults,
            )

            if created:
                created_services += 1
            else:
                updated_services += 1

        created_tiers = 0
        updated_tiers = 0

        for tier_data in OG_TIERS:
            _, created = SubscriptionTier.objects.update_or_create(
                name=tier_data["name"],
                defaults={
                    "price": tier_data["price"],
                    "max_usage": tier_data["max_usage"],
                },
            )

            if created:
                created_tiers += 1
            else:
                updated_tiers += 1

        self.stdout.write(self.style.SUCCESS("OG data seeding complete."))
        self.stdout.write(
            f"Users -> created: {created_users}, updated: {updated_users}. "
            f"Services -> created: {created_services}, updated: {updated_services}. "
            f"Tiers -> created: {created_tiers}, updated: {updated_tiers}."
        )
        if not reset_passwords:
            self.stdout.write("Tip: use --reset-passwords to force OG password reset for existing users.")
