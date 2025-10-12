from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ..models import GroceryItem, GroceryList
from ..serializers import GroceryItemSerializer, GroceryListSerializer
from ..services.fairprice_api import search_grocery_items as fairprice_search


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def search_grocery_items(request):
    """Search for grocery items"""
    query = request.GET.get("query")

    if not query:
        return Response(
            {"error": "Query parameter is required"}, status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Search using FairPrice API
        items = fairprice_search(query)
        return Response(items, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {"error": f"Grocery search failed: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def grocery_lists(request):
    """List or create grocery lists for the authenticated user."""

    if request.method == "GET":
        grocery_lists_qs = (
            GroceryList.objects.filter(user=request.user)
            .order_by("created_at")
            .prefetch_related("items")
        )
        serializer = GroceryListSerializer(grocery_lists_qs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    serializer = GroceryListSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def grocery_list_detail(request, list_id):
    """Retrieve, update, or delete a specific grocery list."""

    grocery_list = get_object_or_404(GroceryList, id=list_id, user=request.user)

    if request.method == "GET":
        serializer = GroceryListSerializer(grocery_list)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == "PUT":
        serializer = GroceryListSerializer(grocery_list, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    grocery_list.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def grocery_items(request):
    """List or create grocery items for the authenticated user."""

    if request.method == "GET":
        grocery_list_id = request.query_params.get("grocery_list")
        items_qs = GroceryItem.objects.filter(grocery_list__user=request.user)
        if grocery_list_id:
            items_qs = items_qs.filter(grocery_list_id=grocery_list_id)
        serializer = GroceryItemSerializer(items_qs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    serializer = GroceryItemSerializer(data=request.data)
    if serializer.is_valid():
        grocery_list = serializer.validated_data["grocery_list"]
        if grocery_list.user != request.user:
            return Response(
                {"error": "You cannot add items to another user's grocery list."},
                status=status.HTTP_403_FORBIDDEN,
            )
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def grocery_item_detail(request, item_id):
    """Retrieve, update, or delete a specific grocery item."""

    grocery_item = get_object_or_404(
        GroceryItem, id=item_id, grocery_list__user=request.user
    )

    if request.method == "GET":
        serializer = GroceryItemSerializer(grocery_item)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == "PUT":
        serializer = GroceryItemSerializer(grocery_item, data=request.data)
        if serializer.is_valid():
            grocery_list = serializer.validated_data.get(
                "grocery_list", grocery_item.grocery_list
            )
            if grocery_list.user != request.user:
                return Response(
                    {"error": "You cannot move items to another user's grocery list."},
                    status=status.HTTP_403_FORBIDDEN,
                )
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    grocery_item.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
