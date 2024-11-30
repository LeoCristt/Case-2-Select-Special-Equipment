from rest_framework import serializers
from .models import Request, Machinery, Waybill, Subdivision, Master

class RequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Request
        fields = '__all__'

class MachinerySerializer(serializers.ModelSerializer):
    class Meta:
        model = Machinery
        fields = '__all__'

class WaybillSerializer(serializers.ModelSerializer):
    planned_time_of_departure = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S')
    planned_time_of_arrival_at_the_facility = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S')
    actual_time_of_departure = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S', required=False)
    actual_time_of_arrival_at_the_facility = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S', required=False)
    class Meta:
        model = Waybill
        fields = '__all__'

class SubdivisionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subdivision
        fields = '__all__'

class MasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Master
        fields = '__all__'
