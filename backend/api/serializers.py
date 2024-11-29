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
    class Meta:
        model = Waybill
        fields = '__all__'
