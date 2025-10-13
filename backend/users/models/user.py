from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid


class User(AbstractUser):
    """Custom User model extending Django's AbstractUser"""
    
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Set username to a unique UUID
    username = models.CharField(
        max_length=150, 
        unique=True, 
        default=uuid.uuid4
    )

    # Add gender here
    
    USERNAME_FIELD = 'email'
    # Add username to REQUIRED_FIELDS
    REQUIRED_FIELDS = ['username']
    
    def __str__(self):
        return self.email