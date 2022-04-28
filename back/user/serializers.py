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


class AccountSerializer(serializers.Serializer):

    iban = serializers.CharField(required=True, max_length=34)
    acc_type = serializers.ChoiceField(
        choices=Account.ACCOUNT_TYPE_CHOICES,
        default=Account.CURRENT
    )
    #owner = serializers.ForeignKey(CustomUser)
    balance = serializers.DecimalField(max_digits=20, decimal_places=6, default=0.0)
    currency = serializers.CharField(required=True, max_length=3)
    #creation_time = serializers.DateTimeField('creation date', auto_now_add=True)
    #last_updated_time = serializers.DateTimeField('last updated date', auto_now=True)

    def create(self, validated_data):
        return Account.objects.create(**validated_data)

    def update(self, instance: Account, validated_data):
        instance.iban = validated_data.get('iban', instance.iban)
        instance.acc_type = validated_data.get('acc_type', instance.acc_type)
        #instance.owner = validated_data('owner', instance.owner)
        instance.balance = validated_data('balance', instance.balance)
        instance.currency = validated_data('currency', instance.currency)
        instance.save()
        return instance

