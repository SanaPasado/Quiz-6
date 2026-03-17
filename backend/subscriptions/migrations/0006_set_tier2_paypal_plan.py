from django.db import migrations


TIER_2_PLAN_ID = "P-5JA26563KT1248648NG4YEUY"


def set_tier_2_plan_id(apps, schema_editor):
    SubscriptionTier = apps.get_model("subscriptions", "SubscriptionTier")
    SubscriptionTier.objects.filter(name="Tier 2").update(paypal_plan_id=TIER_2_PLAN_ID)


def unset_tier_2_plan_id(apps, schema_editor):
    SubscriptionTier = apps.get_model("subscriptions", "SubscriptionTier")
    SubscriptionTier.objects.filter(name="Tier 2", paypal_plan_id=TIER_2_PLAN_ID).update(paypal_plan_id=None)


class Migration(migrations.Migration):

    dependencies = [
        ("subscriptions", "0005_set_tier1_paypal_plan"),
    ]

    operations = [
        migrations.RunPython(set_tier_2_plan_id, unset_tier_2_plan_id),
    ]
