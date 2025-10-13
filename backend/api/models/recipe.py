from django.db import models
from django.conf import settings
import hashlib


class Recipe(models.Model):
    """Recipe model for storing unique recipe details"""
    
    DIFFICULTY_CHOICES = [
        ('Easy', 'Easy'),
        ('Medium', 'Medium'),
        ('Hard', 'Hard'),
    ]
    
    name = models.CharField(max_length=255)
    time_taken_minutes = models.PositiveIntegerField(null=True, blank=True)
    difficulty = models.CharField(max_length=50, choices=DIFFICULTY_CHOICES, null=True, blank=True)
    calories = models.PositiveIntegerField(null=True, blank=True)
    macros = models.JSONField(null=True, blank=True)  # {"protein": "22g", "carbs": "45g", "fat": "12g"}
    ingredients = models.JSONField()  # [{"item": "Chicken", "amount": "500g", "unit": "g"}]
    steps = models.JSONField()  # ["Step 1: ...", "Step 2: ..."]
    image_url = models.URLField(blank=True, null=True)
    source_hash = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def save(self, *args, **kwargs):
        # Generate source_hash from recipe content if not provided
        if not self.source_hash:
            content = f"{self.name}{self.ingredients}{self.steps}"
            self.source_hash = hashlib.md5(content.encode()).hexdigest()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name


class UserSavedRecipe(models.Model):
    """Join table for user-saved recipes"""
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    saved_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'recipe')
    
    def __str__(self):
        u = getattr(self.user, "email", str(self.user))
        return f"{u} saved {self.recipe.name}"

