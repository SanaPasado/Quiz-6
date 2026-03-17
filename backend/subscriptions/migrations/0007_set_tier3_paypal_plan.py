from django.db import migrations


TIER_3_PLAN_ID = "P-5GP61969RS731520ANG4YFKY"


def set_tier_3_plan_id(apps, schema_editor):
    SubscriptionTier = apps.get_model("subscriptions", "SubscriptionTier")
    SubscriptionTier.objects.filter(name="Tier 3").update(paypal_plan_id=TIER_3_PLAN_ID)


def unset_tier_3_plan_id(apps, schema_editor):
    SubscriptionTier = apps.get_model("subscriptions", "SubscriptionTier")
    SubscriptionTier.objects.filter(name="Tier 3", paypal_plan_id=TIER_3_PLAN_ID).update(paypal_plan_id=None)


class Migration(migrations.Migration):

    dependencies = [
        ("subscriptions", "0006_set_tier2_paypal_plan"),
    ]

    operations = [
        migrations.RunPython(set_tier_3_plan_id, unset_tier_3_plan_id),
    ]
