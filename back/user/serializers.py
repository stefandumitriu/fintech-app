from django.utils import timezone
from rest_framework import serializers
from .models import CustomUser, Account


class CustomUserSerializer(serializers.Serializer):

    id = serializers.IntegerField(read_only=True)
    user_name = serializers.CharField(required=True, max_length=50)
    last_login = serializers.DateTimeField(required=False, default=timezone.now)
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=True, max_length=150)
    last_name = serializers.CharField(required=True, max_length=150)
    birthdate = serializers.DateTimeField(default=timezone.now)
    address = serializers.CharField(required=False, default="", allow_blank=True)
    phone_number = serializers.CharField(required=True, max_length=12)
    is_active = serializers.BooleanField(default=True, required=False)

    def create(self, validated_data):
        return CustomUser.objects.create(**validated_data)

    def update(self, instance: CustomUser, validated_data):
        instance.user_name = validated_data.get('user_name', instance.user_name)
        instance.email = validated_data.get('email', instance.email)
        instance.last_login = validated_data.get('last_login', instance.last_login)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.birthdate = validated_data.get('birthdate', instance.birthdate)
        instance.address = validated_data.get('address', instance.address)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.is_active = validated_data.get('is_active', instance.is_active)
        instance.save()
        return instance
