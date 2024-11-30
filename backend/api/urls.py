from django.urls import path
from .views import RequestList, SubdivisionList, MasterList, MachineryList, WaybillList, CustomTokenObtainPairView  # Импортируем кастомное представление
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('request/', RequestList.as_view(), name='request-list'),
    path('request/<int:pk>/', RequestList.as_view(), name='request-detail'),
    path('request/<int:pk>/<int:list_index>/', RequestList.as_view(), name='request-edit'),
    path('request/<str:subdivision>/', RequestList.as_view(), name='request-subdivision'),
    path('request/<int:pk>/<int:list_index>/<int:machinery_index>/', RequestList.as_view(), name='request-machinery-delete'),

    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),  # Используем кастомный токен
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('subdivision/', SubdivisionList.as_view(), name='subdivision-list'),

    path('master/', MasterList.as_view(), name='master-list'),

    path('machinery/', MachineryList.as_view(), name='machinery-list'),

    path('waybill/', WaybillList.as_view(), name='waybill-list'),
    path('waybill/<int:pk>/', WaybillList.as_view(), name='waybill-edit'),
    path('waybill/<str:subdivision>/', WaybillList.as_view(), name='waybill-list_subdivision'),
]
