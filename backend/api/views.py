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
        serializer = RequestSerializer(requests, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data.copy()
        try:
            subdivision = Subdivision.objects.get(name=request.data['subdivision'])
            data['subdivision'] = subdivision.id  # Передаем ID объекта
        except Subdivision.DoesNotExist:
            return Response({"error": f"Subdivision with name {request.data['subdivision']} not found."}, status=status.HTTP_404_NOT_FOUND)
        try:
            master = Master.objects.get(last_name=request.data['master'].split(" ")[0], first_name=request.data['master'].split(" ")[1], patronymic=request.data['master'].split(" ")[2])
            data['master'] = master.id
        except Subdivision.DoesNotExist:
            return Response({"error": f"Subdivision with name {request.data['subdivision']} not found."}, status=status.HTTP_404_NOT_FOUND)
        try:
            for i in range(0, len(request.data['date_type_quantity_plannedWorkTime']) + 1):
                type = Type.objects.get(name=request.data['date_type_quantity_plannedWorkTime'][i]['type'])
                data['date_type_quantity_plannedWorkTime'][i]['type'] = type.id
        except Subdivision.DoesNotExist:
            return Response({"error": f"Type with name {request.data['subdivision']} not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = RequestSerializer(data=data)
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
    
    #def put (self, request, pk=None):

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

        # Генерируем AccessToken
        access_token = refresh.access_token
        access_token['role'] = user.role
        access_token['subdivision'] = user.subdivision.name  # То же самое для access токена

        # Формируем ответ с токенами
        return Response({
            'refresh': str(refresh),
            'access': str(access_token),
        })

