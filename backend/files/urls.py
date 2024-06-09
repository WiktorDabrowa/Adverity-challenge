from rest_framework.routers import DefaultRouter
from .views import FileViewSet, enrich_file
from django.urls import path

router = DefaultRouter()
router.register(r'', FileViewSet, basename='files')
urlpatterns = [
    path('enrich', enrich_file)
]
urlpatterns += router.urls
