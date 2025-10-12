from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from ..models import UserGroceryList
from ..serializers import UserGroceryListSerializer
from ..services.fairprice_api import search_grocery_items as fairprice_search


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_grocery_items(request):
    """Search for grocery items"""
    query = request.GET.get('query')
    
    if not query:
        return Response(
            {'error': 'Query parameter is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Search using FairPrice API
        items = fairprice_search(query)
        return Response(items, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': f'Grocery search failed: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_grocery_list(request):
    """Get user's grocery list"""
    try:
        grocery_items = UserGroceryList.objects.filter(user=request.user).order_by('-added_at')
        serializer = UserGroceryListSerializer(grocery_items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': f'Failed to retrieve grocery list: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_grocery_list(request):
    """Add an item to user's grocery list"""
    try:
        serializer = UserGroceryListSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        return Response(
            {'error': f'Failed to add item to grocery list: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_grocery_list(request, item_id):
    """Remove an item from user's grocery list"""
    try:
        grocery_item = get_object_or_404(
            UserGroceryList, 
            user=request.user, 
            id=item_id
        )
        grocery_item.delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)
        
    except Exception as e:
        return Response(
            {'error': f'Failed to remove item from grocery list: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
