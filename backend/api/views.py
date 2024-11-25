from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Request
from .serializers import RequestSerializer, MachinerySerializer
from rest_framework.exceptions import NotFound
from rest_framework import serializers
from .models import CustomUser, Subdivision, Master, Machinery
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

class RequestList(APIView):
    def get(self, request, subdivision=None):
        if subdivision != None:
            try:
                subdivisionObj = Subdivision.objects.get(name=subdivision)
            except Subdivision.DoesNotExist:
                return Response({"error": f"Subdivision with name {subdivision} not found."}, status=status.HTTP_404_NOT_FOUND)
        
            requests = Request.objects.filter(subdivision=subdivisionObj).exclude(processed_by_logistician=True)
        else:
            requests = Request.objects.filter(processed_by_logistician=True)

        # Преобразуем данные для ответа
        result = []
        for request_obj in requests:
            # Преобразуем объект модели в словарь
            request_data = {
                "id": request_obj.id,
                "master": {
                    "name": request_obj.master.name,
                    "facility": request_obj.master.facility.name
                },
                "distance": request_obj.distance,
                "processed_by_logistician": request_obj.processed_by_logistician,
                "date_type_quantity_plannedWorkTime_machinery": request_obj.date_type_quantity_plannedWorkTime_machinery,

            }

            result.append(request_data)

        return Response(result)

    def post(self, request):
        data = request.data.copy()

        try:
            subdivision = Subdivision.objects.get(name=request.data['subdivision'])
        except Subdivision.DoesNotExist:
            return Response({"error": f"Subdivision with name {request.data['subdivision']} not found."}, status=status.HTTP_404_NOT_FOUND)
        
        data['subdivision'] = subdivision.name  # Передаем ID объекта
        
        try:
            master = Master.objects.get(name=request.data['master'])
        except Master.DoesNotExist:
            return Response({"error": f"Master with name '{request.data['master']}' does not exist."}, status=status.HTTP_404_NOT_FOUND)
        
        data['master'] = master.name

        serializer = RequestSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, pk=None, list_index=None):
        try:
            # Получаем объект по первичному ключу (pk)
            request_instance = Request.objects.get(pk=pk)
        except Request.DoesNotExist:
            return Response({"error": f"Request with id {pk} not found."}, status=status.HTTP_404_NOT_FOUND)

        # Получаем существующий JSON из поля date_type_quantity_plannedWorkTime
        existing_data = request_instance.date_type_quantity_plannedWorkTime_machinery or []

        # Получаем данные из запроса
        new_data = request.data
        if not new_data or not isinstance(new_data, dict):
            request_instance.processed_by_logistician = True
            request_instance.save()
            return Response({"success": "Обработано логистом."}, status=status.HTTP_200_OK)

        # Добавляем новый словарь в существующие данные
        if list_index == None:
            existing_data.append(new_data)
        else:
            existing_data[list_index] = new_data

        # Обновляем поле модели
        request_instance.date_type_quantity_plannedWorkTime_machinery = existing_data
        request_instance.save()

        return Response({"success": "Entry added successfully", "updated_data": existing_data}, status=status.HTTP_200_OK)


class SubdivisionList(APIView):
    def get(self, request):
        requests = Subdivision.objects.all()
        serializer = RequestSerializer(requests, many=True)
        return Response(serializer.data)
    
class MasterList(APIView):
    def get(self, request):
        requests = Master.objects.all()
        serializer = RequestSerializer(requests, many=True)
        return Response(serializer.data)

class MachineryList(APIView):
    def get(self, request):
        requests = Machinery.objects.all()
        serializer = MachinerySerializer(requests, many=True)
        return Response(serializer.data)

# Создаем новый сериализатор для получения токенов с дополнительными данными
class CustomTokenObtainPairSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        # Проводим стандартную проверку данных
        username = attrs.get('username')
        password = attrs.get('password')

        user = CustomUser.objects.filter(username=username).first()

        if user is None or not user.check_password(password):
            raise serializers.ValidationError('Неверные имя пользователя или пароль.')

        # Возвращаем пользователя для дальнейшего использования в payload
        return {
            'user': user
        }

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        # Получаем сериализованные данные
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Получаем пользователя, чтобы добавить дополнительные данные в токен
        user = serializer.validated_data['user']
        
        # Создаем RefreshToken
        refresh = RefreshToken.for_user(user)
        
        refresh['role'] = user.role 
        refresh['subdivision'] = user.subdivision.name
        refresh['username'] = user.username

        # Генерируем AccessToken
        access_token = refresh.access_token
        access_token['role'] = user.role
        access_token['subdivision'] = user.subdivision.name 
        access_token['username'] = user.username

        # Формируем ответ с токенами
        return Response({
            'refresh': str(refresh),
            'access': str(access_token),
        })

