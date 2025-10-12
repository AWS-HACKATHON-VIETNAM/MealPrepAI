from django.db import models
from django.conf import settings


class GroceryList(models.Model):
    """User's personal grocery list or pantry"""

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.name}"


class GroceryItem(models.Model):
    """An item in a user's grocery list or pantry"""

    grocery_list = models.ForeignKey(
        GroceryList, related_name="items", on_delete=models.CASCADE
    )
    ingredient = models.CharField(max_length=255)
    quantity = models.CharField(max_length=100)  # e.g., "500g", "1 can"
    price = models.FloatField(null=True, blank=True)
    macros = models.JSONField(
        null=True, blank=True
    )  # {"protein": 10, "carbs": 20, "fat": 5}
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.ingredient} ({self.quantity}) in {self.grocery_list.name}"
