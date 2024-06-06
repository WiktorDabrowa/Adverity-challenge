from rest_framework.decorators import api_view
from rest_framework.views import Response
from rest_framework import status
from .serializers import UserSerializer
from .models import User


@api_view(['POST'])
def create_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        new_user = serializer.save()
        if new_user:
            return Response(status=status.HTTP_200_OK, data='User created')
    return Response(status=status.HTTP_400_BAD_REQUEST, data=serializer.errors)

@api_view(['DELETE'])
def delete_user(reqest):
    pass


# TODO: ONLY FOR DEBUGGING
@api_view(['GET'])
def list_users(request):
    objects = User.objects.all()
    data = UserSerializer(objects, many=True).data
    return Response(data=data)