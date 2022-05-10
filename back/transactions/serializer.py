from rest_framework import serializers
from .models import Transaction
from user.models import CustomUser


class TransactionSerializer(serializers.ModelSerializer):
    sender = serializers.SlugRelatedField(many=False, read_only=False, queryset=CustomUser.objects.all(),
                                         slug_field="email")
    receiver = serializers.SlugRelatedField(many=False, read_only=False, queryset=CustomUser.objects.all(),
                                         slug_field="email")

    class Meta:
        model = Transaction
        fields = ['id', 'amount', 'currency', 'sender', 'receiver']