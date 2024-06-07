from django.db import models
from users.models import User


class File(models.Model):

    name = models.CharField(max_length=64)
    url = models.CharField(max_length=1024, unique=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)