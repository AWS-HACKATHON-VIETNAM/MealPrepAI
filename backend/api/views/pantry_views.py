from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ..models import PantryItem
from ..serializers import PantryItemSerializer


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def pantry_items(request):
    """List or create pantry items for the authenticated user."""

    if request.method == "GET":
        pantry_qs = PantryItem.objects.filter(user=request.user).order_by("name")
        serializer = PantryItemSerializer(pantry_qs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    serializer = PantryItemSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def pantry_item_detail(request, item_id):
    """Retrieve, update, or delete a specific pantry item."""

    pantry_item = get_object_or_404(PantryItem, id=item_id, user=request.user)

    if request.method == "GET":
        serializer = PantryItemSerializer(pantry_item)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == "PUT":
        serializer = PantryItemSerializer(pantry_item, data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    pantry_item.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
