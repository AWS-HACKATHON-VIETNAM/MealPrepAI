from django.db import models
from django.conf import settings


class UserProfile(models.Model):
    """User profile model for storing personal and preference data"""
    
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ]
    
    GOAL_CHOICES = [
        ('lose_fat', 'Lose Fat'),
        ('gain_muscle', 'Gain Muscle'),
        ('maintain', 'Maintain Weight'),
        ('general_health', 'General Health'),
    ]
    
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='profile'
    )
    
    weight_kg = models.FloatField(null=True, blank=True)
    height_cm = models.FloatField(null=True, blank=True)
    gender = models.CharField(null=True, choices = GENDER_CHOICES)
    preferences = models.JSONField(default=list, blank=True)  # Array of strings
    allergies = models.JSONField(default=list, blank=True)    # Array of strings
    goal = models.CharField(max_length=50, choices=GOAL_CHOICES, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.email} - Profile"
