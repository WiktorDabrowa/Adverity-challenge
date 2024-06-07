from rest_framework.serializers import ModelSerializer
from .models import File


class FileSerializer(ModelSerializer):
    class Meta:
        model = File
        fields = '__all__'

class FileListSerializer(ModelSerializer):
    class Meta:
        model = File
        exclude = ['url']
