from django.urls import path
from .views import Request

urlpatterns = [
    path('requests/', Request.as_view(), name='request-list'),
]
