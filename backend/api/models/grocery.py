from django.db import models
from django.conf import settings


class UserGroceryList(models.Model):
    """User's personal grocery list or pantry"""
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    ingredient_name = models.CharField(max_length=255)
    quantity = models.CharField(max_length=100)  # e.g., "500g", "1 can"
    price = models.FloatField(null=True, blank=True)
    macros = models.JSONField(null=True, blank=True)  # Nutritional info
    added_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.email} - {self.ingredient_name} ({self.quantity})"
