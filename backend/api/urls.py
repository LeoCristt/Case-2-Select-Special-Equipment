from django.urls import path
from .views import RequestList

urlpatterns = [
    path('requests/', RequestList.as_view(), name='request-list'),
]
