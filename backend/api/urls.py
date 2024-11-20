from django.urls import path
from .views import RequestList, CustomTokenObtainPairView  # Импортируем кастомное представление
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('requests/', RequestList.as_view(), name='request-list'),
    path('requests/<int:pk>/', RequestList.as_view(), name='request-detail'),
    path('requests/<str:subdivision>/', RequestList.as_view(), name='request-subdivision'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),  # Используем кастомный токен
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
