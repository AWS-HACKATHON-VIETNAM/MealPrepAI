from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid


def generate_username():
    """Generate a unique username as a string UUID"""
    return str(uuid.uuid4())


class User(AbstractUser):
    """Custom User model extending Django's AbstractUser"""

    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    # Set username to a unique UUID string
    username = models.CharField(max_length=150, unique=True, default=generate_username)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []  # Empty since username is auto-generated and email is USERNAME_FIELD

    def __str__(self):
        return self.email
