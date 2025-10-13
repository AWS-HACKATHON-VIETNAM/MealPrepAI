from rest_framework import serializers

from ..models import GroceryItem, GroceryList


class GroceryItemSerializer(serializers.ModelSerializer):
    """Serializer for individual grocery items."""

    class Meta:
        model = GroceryItem
        fields = [
            "id",
            "grocery_list",
            "ingredient",
            "quantity",
            "price",
            "macros",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class GroceryListSerializer(serializers.ModelSerializer):
    """Serializer for grocery lists with nested items."""

    items = GroceryItemSerializer(many=True, read_only=True)

    class Meta:
        model = GroceryList
        fields = ["id", "name", "created_at", "items"]
        read_only_fields = ["id", "created_at", "items"]
