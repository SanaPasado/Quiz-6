from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUserModel(AbstractUser):
	class RoleChoices(models.TextChoices):
		ADMIN = "Admin", "Admin"
		SELLER = "Seller", "Seller"
		USER = "User", "User"

	class GenderChoices(models.TextChoices):
		MALE = "Male", "Male"
		FEMALE = "Female", "Female"
		OTHER = "Other", "Other"

	email = models.EmailField(unique=True)
	phone_number = models.CharField(max_length=20)
	location = models.CharField(max_length=255)
	gender = models.CharField(max_length=10, choices=GenderChoices.choices)
	role = models.CharField(max_length=10, choices=RoleChoices.choices, default=RoleChoices.USER)
	merchant_id = models.CharField(max_length=120, blank=True, null=True)

	USERNAME_FIELD = "email"
	REQUIRED_FIELDS = ["username"]

	def __str__(self):
		return f"{self.email} ({self.role})"
