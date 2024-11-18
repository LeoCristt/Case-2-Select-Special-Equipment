from django.urls import path
from .views import RequestList

urlpatterns = [
    path('requests/', RequestList.as_view(), name='request-list'),
    path('requests/<int:pk>/', RequestList.as_view(), name='request-detail'),
]
