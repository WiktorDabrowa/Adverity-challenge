
from django.http import HttpResponse
from django.urls import path, include
from django.views.generic import TemplateView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


def healthcheck(request):
    from django.db import connection
    from .celery import app
    import json

    status = {}
    try:
        tables = connection.introspection.table_names()
        status["DB"] = f"ok, tables: {', '.join(tables)}"
    except Exception as e:
        status["DB"] = f"error, {e}"

    try:
        celery_status = app.control.broadcast('ping', reply=True, limit=1)
        tasks = list(app.control.inspect().registered_tasks().values())[0]
        status["CELERY"] = f"ok, tasks: {', '.join(tasks)}" if celery_status else "error"
    except Exception as e:
        status["CELERY"] = f"error, {e}"

    return HttpResponse(json.dumps(status), content_type='application/json')


urlpatterns = [
    path('healthcheck.json', healthcheck),
    path('users/', include('users.urls')),
    path('token/', TokenObtainPairView.as_view()),
    path('token/refresh', TokenRefreshView.as_view())
]
