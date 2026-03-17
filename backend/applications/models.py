from django.db import models
from django.conf import settings


class SellerApplication(models.Model):
	STATUS_CHOICES = (
		("Pending", "Pending"),
		("Approved", "Approved"),
		("Declined", "Declined"),
	)

	user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="seller_application")
	status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Pending")
	decline_reason = models.TextField(blank=True, null=True)
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f"{self.user.email} - {self.status}"
