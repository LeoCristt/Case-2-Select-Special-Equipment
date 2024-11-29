from rest_framework import serializers
from .models import Request, Machinery, Waybill

class RequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Request
        fields = '__all__'

class MachinerySerializer(serializers.ModelSerializer):
    class Meta:
        model = Machinery
        fields = '__all__'

class WaybillSerializer(serializers.ModelSerializer):
    planned_time_of_departure = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S')  # Можно выбрать свой формат
    planned_time_of_arrival_at_the_facility = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S')  # Можно выбрать свой формат
    actual_time_of_departure = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S', required=False)  # Можно выбрать свой формат
    actual_time_of_arrival_at_the_facility = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S', required=False)  # Можно выбрать свой формат
    class Meta:
        model = Waybill
        fields = '__all__'
