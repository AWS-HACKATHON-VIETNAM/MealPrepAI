from django.db import models
from django.conf import settings


class MealHistory(models.Model):
    """Logs meals that the user has cooked to track nutrition over time"""
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    recipe_name = models.CharField(max_length=255)
    calories_consumed = models.IntegerField()
    macros_consumed = models.JSONField()  # {"protein": 25, "carbs": 50, "fat": 15}
    eaten_at = models.DateTimeField()
    
    def __str__(self):
        return f"{self.user.email} - {self.recipe_name} ({self.eaten_at})"
