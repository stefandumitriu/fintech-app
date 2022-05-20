from django.db import models

# Create your models here.
from django.utils import timezone
from user.models import CustomUser

INC = 'INCOMING'
OUT = 'OUTGOING'
TYPE_CHOICES = (
    (INC, 'INCOMING'),
    (OUT, 'OUTGOING')
)


class Transaction(models.Model):
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='sender')
    receiver = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='receiver')
    amount = models.DecimalField(max_digits=20, decimal_places=2)
    currency = models.CharField(max_length=3)
    timestamp = models.DateTimeField(default=timezone.now)

    objects = models.Manager()


class ExternalTransaction(models.Model):
    client = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    external_peer = models.CharField(max_length=100)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, default=OUT)
    amount = models.DecimalField(max_digits=20, decimal_places=2)
    currency = models.CharField(max_length=3)
    timestamp = models.DateTimeField(default=timezone.now)

    objects = models.Manager()

