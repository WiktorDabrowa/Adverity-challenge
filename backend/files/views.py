from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import FileSerializer, FileListSerializer
from .models import File

class FileViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = FileSerializer
    queryset = File.objects.all()

    def list(self,request):
        files = request.user.file_set.all()
        data = FileListSerializer(files, many=True).data
        return Response(data)

    def retrieve(self, request, pk):
        user = request.user
        file = File.objects.get(id=pk)
        if file.owner != user:
            return Response(
                status=status.HTTP_401_UNAUTHORIZED,
                data="You are not authorized to retrieve this resource!")
        data = FileSerializer(file).data
        return Response(
            status=status.HTTP_200_OK,
            data=data
        )
    
    def destroy(self,request, pk):
        pass