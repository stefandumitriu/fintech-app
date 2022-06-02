from rest_framework import serializers
from .models import CustomUser, Account, Vault, Card
from ionel import settings


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'last_login', 'first_name', 'last_name', 'age', 'address', 'phone_number', 'password']


class AccountSerializer(serializers.ModelSerializer):
    owner = serializers.SlugRelatedField(many=False, read_only=False, queryset=CustomUser.objects.all(),
                                         slug_field="email")
    iban = serializers.CharField(required=False)
    card_expiration_date = serializers.DateTimeField(format="%m/%Y", required=False)


    class Meta:
        model = Account
        fields = ['iban', 'acc_type', 'owner', 'balance', 'currency', 'card_expiration_date', 'card_number']


    def to_representation(self, instance):
        ret = super(AccountSerializer, self).to_representation(instance)
        if instance.acc_type == "SVG":
            ret['goal'] = instance.goal
            ret['deadline_date'] = instance.deadline_date.strftime("%Y-%m-%d")
        return ret


class CardSerializer(serializers.ModelSerializer):
    account = AccountSerializer(required=True)
    card_expiration_date = serializers.DateTimeField(format=settings.DATETIME_FORMAT)
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
