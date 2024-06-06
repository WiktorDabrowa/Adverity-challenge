from django.db import models


class File(models.Model):

    name = models.CharField(max_length=64)
    url = models.CharField(max_length=1024, unique=True)