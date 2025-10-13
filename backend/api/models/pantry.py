from django.conf import settings
from django.db import models


class PantryItem(models.Model):
    """An item currently stored in the user's pantry."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="pantry_items",
    )
    name = models.CharField(max_length=255)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "name"],
                name="unique_pantry_item_per_user",
            )
        ]
        ordering = ["name"]

    def __str__(self):
        return self.name
