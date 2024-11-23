from django.urls import path
from .views import RequestList, SubdivisionList, MasterList, CustomTokenObtainPairView  # Импортируем кастомное представление
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('request/', RequestList.as_view(), name='request-list'),
    path('request/<int:pk>/', RequestList.as_view(), name='request-detail'),
    path('request/<int:pk>/<int:list_index>/', RequestList.as_view(), name='request-edit'),
    path('request/<str:subdivision>/', RequestList.as_view(), name='request-subdivision'),

    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),  # Используем кастомный токен
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('subdivision/', SubdivisionList.as_view(), name='subdivision-list'),

    path('master/', MasterList.as_view(), name='master-list'),
]
