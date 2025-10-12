from rest_framework import serializers
from ..models import UserGroceryList


class UserGroceryListSerializer(serializers.ModelSerializer):
    """Serializer for UserGroceryList model"""
    
    class Meta:
        model = UserGroceryList
        fields = [
            'id', 'ingredient_name', 'quantity', 'price', 
            'macros', 'added_at'
        ]
        read_only_fields = ('id', 'added_at')
