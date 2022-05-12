from rest_framework import serializers
from .models import CustomUser, Account, Vault, Card


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


class CardSerializer(serializers.ModelSerializer):
    account = AccountSerializer(required=True)

    class Meta:
        model = Card
        fields = ['account', 'card_expiration_date', 'card_number']

    def create(self, validated_data):
        """
        Overriding the default create method of the Model serializer.
        :param validated_data: data containing all the details of student
        :return: returns a successfully created student record
        """
        account_data = validated_data.pop('account')
        account = AccountSerializer.create(AccountSerializer(), validated_data=account_data)
        card, created = Card.objects.update_or_create(account=account,
                                                      card_number=validated_data.pop('card_number'))
        return card


class VaultSerializer(serializers.ModelSerializer):
    owner = serializers.SlugRelatedField(many=False, read_only=False, queryset=CustomUser.objects.all(),
                                         slug_field="email")

    class Meta:
        model = Vault
        fields = ['name', 'deadline_date', 'goal', 'owner']
