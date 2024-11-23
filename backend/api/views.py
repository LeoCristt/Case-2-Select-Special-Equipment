from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Request
from .serializers import RequestSerializer
from rest_framework.exceptions import NotFound
from rest_framework import serializers
from .models import CustomUser, Subdivision, Type, Master
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

class RequestList(APIView):
    def get(self, request, subdivision=None):
        try:
            subdivisionObj = Subdivision.objects.get(name=subdivision)
        except Subdivision.DoesNotExist:
            return Response({"error": f"Subdivision with name {subdivision} not found."}, status=status.HTTP_404_NOT_FOUND)
        
        requests = Request.objects.filter(subdivision=subdivisionObj)

        # Преобразуем данные для ответа
        result = []
        for request_obj in requests:
            # Преобразуем объект модели в словарь
            request_data = {
                "id": request_obj.id,
                "master": {
                    "first_name": request_obj.master.first_name,
                    "last_name": request_obj.master.last_name,
                    "patronymic": request_obj.master.patronymic,
                    "object": str(request_obj.master.object)
                },
                "distance": request_obj.distance,
                "processed_by_logistician": request_obj.processed_by_logistician,
                "date_type_quantity_plannedWorkTime": []
            }

            for index, entry in enumerate(request_obj.date_type_quantity_plannedWorkTime):
                type_id = entry.get("type")
                if type_id:
                    # Заменяем индекс type на его имя
                    type_name = Type.objects.get(id=type_id).name
                    entry["type"] = type_name
                # Добавляем индекс итерации в данные (если нужно)
                entry["list_index"] = index
                request_data["date_type_quantity_plannedWorkTime"].append(entry)

            result.append(request_data)

        return Response(result)

    def post(self, request):
        data = request.data.copy()

        try:
            subdivision = Subdivision.objects.get(name=request.data['subdivision'])
        except Subdivision.DoesNotExist:
            return Response({"error": f"Subdivision with name {request.data['subdivision']} not found."}, status=status.HTTP_404_NOT_FOUND)
        
        data['subdivision'] = subdivision.id  # Передаем ID объекта

        master_data = request.data.get('master', '').split(" ")
        
        if len(master_data) != 3:
            return Response({"error": "Invalid format for 'master'. Must include 'last_name', 'first_name', and 'patronymic'."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            master = Master.objects.get(
                last_name=master_data[0],
                first_name=master_data[1],
                patronymic=master_data[2]
            )
        except Master.DoesNotExist:
            return Response({"error": f"Master with name '{request.data['master']}' does not exist."}, status=status.HTTP_404_NOT_FOUND)
        
        data['master'] = master.id
        
        try:
            for i in range(0, len(request.data['date_type_quantity_plannedWorkTime'])):
                type = Type.objects.get(name=request.data['date_type_quantity_plannedWorkTime'][i]['type'])
        except Subdivision.DoesNotExist:
            return Response({"error": f"Type with name {request.data['subdivision']} not found."}, status=status.HTTP_404_NOT_FOUND)
        
        data['date_type_quantity_plannedWorkTime'][i]['type'] = type.id

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
        existing_data = request_instance.date_type_quantity_plannedWorkTime or []

        # Получаем данные из запроса
        new_data = request.data
        if not new_data or not isinstance(new_data, dict):
            return Response({"error": "Invalid data format. New entry must be a dictionary."}, status=status.HTTP_400_BAD_REQUEST)

        # Проверяем, что поле 'type' в новом словаре существует и заменяем его значение на ID
        if "type" in new_data:
            try:
                type_instance = Type.objects.get(name=new_data["type"])
                new_data["type"] = type_instance.id  # Заменяем имя типа на его ID
            except Type.DoesNotExist:
                return Response({"error": f"Type with name '{new_data['type']}' not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"error": "Field 'type' is required in the new entry."}, status=status.HTTP_400_BAD_REQUEST)

        # Добавляем новый словарь в существующие данные
        if list_index == None:
            existing_data.append(new_data)
        else:
            existing_data[list_index] = new_data
            print(new_data)

        # Обновляем поле модели
        request_instance.date_type_quantity_plannedWorkTime = existing_data
        request_instance.save()

        return Response({"success": "Entry added successfully", "updated_data": existing_data}, status=status.HTTP_200_OK)


class SubdivisionList(APIView):
    def get(self, request):
        requests = Subdivision.objects.all()
        serializer = RequestSerializer(requests, many=True)
        return Response(serializer.data)
    
class TypeList(APIView):
    def get(self, request):
        requests = Type.objects.all()
        serializer = RequestSerializer(requests, many=True)
        return Response(serializer.data)
    
class MasterList(APIView):
    def get(self, request):
        requests = Master.objects.all()
        serializer = RequestSerializer(requests, many=True)
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

