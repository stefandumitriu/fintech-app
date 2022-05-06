from rest_framework import serializers
from .models import CustomUser, Account


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['user_name', 'email', 'last_login', 'first_name', 'last_name', 'birthdate', 'address', 'phone_number']


class AccountSerializer(serializers.ModelSerializer):
    owner = serializers.SlugRelatedField(many=False, read_only=False, queryset=CustomUser.objects.all(),
                                         slug_field="user_name")

    class Meta:
        model = Account
        fields = ['iban', 'acc_type', 'owner', 'balance', 'currency']
