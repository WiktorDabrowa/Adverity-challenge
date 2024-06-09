from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.core.files.storage import default_storage
from django.core.exceptions import ValidationError
from .models import File as File
from .serializers import FileSerializer, FileListSerializer
from .exceptions import EnrichementError
from .utils import prepare_file_data, create_new_file, create_new_csv_file
from .enrich import  FileEnricher

from pprint import pprint # TODO: remove


class FileViewSet(viewsets.GenericViewSet):
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
        file_data = prepare_file_data(file)
        return Response(
            status=status.HTTP_200_OK,
            data=file_data
        )

    def create(self, request):
        file = request.data['file']
        file_name = request.data['name']
        if '/' in file_name:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data="File name cannot contain '/'!"
            )
        create_new_file(
            file_name=file_name,
            owner=request.user,
            file=file
        )
        return Response(status=status.HTTP_201_CREATED, data="File saved")


@api_view(['POST'])
def enrich_file(request):
    file = File.objects.get(pk=request.data['file'])
    if file.owner != request.user:
        return Response(
            status=status.HTTP_401_UNAUTHORIZED,
            data="You are not authorized to access this resource")
    
    try:
        enricher = FileEnricher(file, request)
        new_file_content = enricher.enrich_file()
    except ValidationError as e:
        return Response(
             status=status.HTTP_400_BAD_REQUEST,
             data=e.message
         )
    except EnrichementError as e:
        return Response(
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            data=str(e)
        )
    new_csv_file = create_new_csv_file(new_file_content)
    print(new_csv_file)
    create_new_file(
        file_name=request.data['newFileName'],
        owner=request.user,
        file=new_csv_file
    )
    return Response(status=status.HTTP_201_CREATED, data="Enriched file created!")
