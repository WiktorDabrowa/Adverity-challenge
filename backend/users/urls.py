from django.urls import path
from .views import create_user, list_users

urlpatterns = [
    path('register', create_user),
    path('', list_users)
]