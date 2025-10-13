from rest_framework import serializers

from ..models import PantryItem


class PantryItemSerializer(serializers.ModelSerializer):
    """Serializer for pantry items owned by a user."""

    class Meta:
        model = PantryItem
        fields = [
            "id",
            "name",
            "notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
