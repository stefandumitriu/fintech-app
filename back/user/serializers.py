from rest_framework import serializers
from .models import CustomUser, Account, Vault


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'last_login', 'first_name', 'last_name', 'age', 'address', 'phone_number', 'password']


class AccountSerializer(serializers.ModelSerializer):
    owner = serializers.SlugRelatedField(many=False, read_only=False, queryset=CustomUser.objects.all(),
                                         slug_field="email")

    class Meta:
        model = Account
        fields = ['iban', 'acc_type', 'owner', 'balance', 'currency']


class VaultSerializer(serializers.ModelSerializer):
    owner = serializers.SlugRelatedField(many=False, read_only=False, queryset=CustomUser.objects.all(),
                                         slug_field="email")

    class Meta:
        model = Vault
        fields = ['name', 'deadline_date', 'goal', 'owner']


class ExchangeSerializer(serializers.ModelSerializer):
    base_currency = serializers.CharField(max_length=3)
    to_currency = serializers.CharField(max_length=3)
    amount = serializers.DecimalField(max_digits=20, decimal_places=6)

