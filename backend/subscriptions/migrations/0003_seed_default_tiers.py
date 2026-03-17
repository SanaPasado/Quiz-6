from django.db import migrations


def seed_subscription_tiers(apps, schema_editor):
    SubscriptionTier = apps.get_model("subscriptions", "SubscriptionTier")

    default_tiers = [
        {"name": "Tier 1", "price": "150.00", "max_usage": 3},
        {"name": "Tier 2", "price": "300.00", "max_usage": 5},
        {"name": "Tier 3", "price": "450.00", "max_usage": 10},
    ]

    for tier in default_tiers:
        SubscriptionTier.objects.update_or_create(
            name=tier["name"],
            defaults={
                "price": tier["price"],
                "max_usage": tier["max_usage"],
            },
        )


def unseed_subscription_tiers(apps, schema_editor):
    SubscriptionTier = apps.get_model("subscriptions", "SubscriptionTier")
    SubscriptionTier.objects.filter(name__in=["Tier 1", "Tier 2", "Tier 3"]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("subscriptions", "0002_initial"),
    ]

    operations = [
        migrations.RunPython(seed_subscription_tiers, unseed_subscription_tiers),
    ]
