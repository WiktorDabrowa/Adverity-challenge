from rest_framework.routers import DefaultRouter
from .views import FileViewSet

router = DefaultRouter()
router.register(r'', FileViewSet, basename='files')
urlpatterns = router.urls