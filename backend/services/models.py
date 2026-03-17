from django.db import models
from django.conf import settings


class Service(models.Model):
	seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="services")
	service_name = models.CharField(max_length=255)
	description = models.TextField()
	price = models.DecimalField(max_digits=10, decimal_places=2)
	duration_of_service = models.CharField(max_length=100)
	sample_image = models.ImageField(upload_to="services/", blank=True, null=True)

	def __str__(self):
		return f"{self.service_name} - {self.seller.email}"
