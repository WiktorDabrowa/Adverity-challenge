from rest_framework.serializers import ModelSerializer
from .models import User

class UserSerializer(ModelSerializer):

    class Meta:
        model=User
        fields = ['username', 'password']
        extra_kwargs = {
            'password': {
                'write_only': True,
                'required': True
            },
            'username': {'required': True}
        }

    def create(self, validated_data: dict):
        password = validated_data.pop('password')
        instance = self.Meta.model(**validated_data)
        instance.set_password(password)
        instance.save()
        return instance