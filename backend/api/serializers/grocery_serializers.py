from rest_framework import serializers  # type: ignore
from ..models import GroceryList, GroceryItem


class GroceryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroceryItem
        fields = ["id", "grocery_list", "ingredient", "quantity", "unit"]


class GroceryListSerializer(serializers.ModelSerializer):
    items = GroceryItemSerializer(many=True, read_only=True)  # nested readback

    class Meta:
        model = GroceryList
        fields = ["id", "user", "name", "created_at", "items"]
        read_only_fields = ["id", "created_at", "items"]
