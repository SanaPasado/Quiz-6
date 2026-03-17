from django.db import migrations


TIER_1_PLAN_ID = "P-7GF45292EC6718043NG4YEEA"


def set_tier_1_plan_id(apps, schema_editor):
    SubscriptionTier = apps.get_model("subscriptions", "SubscriptionTier")
    SubscriptionTier.objects.filter(name="Tier 1").update(paypal_plan_id=TIER_1_PLAN_ID)


def unset_tier_1_plan_id(apps, schema_editor):
    SubscriptionTier = apps.get_model("subscriptions", "SubscriptionTier")
    SubscriptionTier.objects.filter(name="Tier 1", paypal_plan_id=TIER_1_PLAN_ID).update(paypal_plan_id=None)


class Migration(migrations.Migration):

    dependencies = [
        ("subscriptions", "0004_paypal_fields"),
    ]

    operations = [
        migrations.RunPython(set_tier_1_plan_id, unset_tier_1_plan_id),
    ]
