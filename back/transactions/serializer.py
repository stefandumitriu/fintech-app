from django.utils import timezone
from rest_framework import serializers
from .models import Transaction, ExternalTransaction
from user.models import CustomUser

from ionel import settings


class TransactionSerializer(serializers.ModelSerializer):
    sender = serializers.SlugRelatedField(many=False, read_only=False, queryset=CustomUser.objects.all(),
                                         slug_field="email")
    receiver = serializers.SlugRelatedField(many=False, read_only=False, queryset=CustomUser.objects.all(),
                                         slug_field="email")
    timestamp = serializers.DateTimeField(format=settings.DATETIME_FORMAT, default=timezone.now)

    class Meta:
        model = Transaction
        fields = ['id', 'amount', 'currency', 'sender', 'receiver', 'timestamp']


class ExternalTransactionSerializer(serializers.ModelSerializer):
    client = serializers.SlugRelatedField(many=False, read_only=False, queryset=CustomUser.objects.all(),
                                          slug_field="email")
    timestamp = serializers.DateTimeField(format=settings.DATETIME_FORMAT, default=timezone.now)

    class Meta:
        model = ExternalTransaction
        fields = ['id', 'client', 'external_peer', 'amount', 'currency', 'type', 'timestamp']