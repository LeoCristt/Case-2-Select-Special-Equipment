from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Request
from .serializers import RequestSerializer
from rest_framework.exceptions import NotFound

class RequestList(APIView):
    def get(self, request):
        requests = Request.objects.all()
        serializer = RequestSerializer(requests, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = RequestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, pk=None):
        try:
            # Получаем объект по первичному ключу (pk)
            request_instance = Request.objects.get(pk=pk)
        except Request.DoesNotExist:
            return Response({"error": f"Request with id {pk} not found."}, status=status.HTTP_404_NOT_FOUND)

        # Получаем существующий JSON из поля date_type_quantity_plannedWorkTime
        existing_data = request_instance.date_type_quantity_plannedWorkTime or []

        # Проверяем, что переданы данные для добавления
        new_data = request.data
        print(new_data)
        if not new_data or not isinstance(new_data, dict):
            return Response({"error": "Invalid data format. 'new_entry' must be a dictionary."}, status=status.HTTP_400_BAD_REQUEST)

        # Добавляем новый словарь в массив
        existing_data.append(new_data)

        # Обновляем поле модели
        request_instance.date_type_quantity_plannedWorkTime = existing_data
        request_instance.save()

        return Response({"success": "Entry added successfully", "updated_data": existing_data}, status=status.HTTP_200_OK)
