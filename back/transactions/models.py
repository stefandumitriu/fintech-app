from django.db import models

# Create your models here.
from user.models import CustomUser


class Transaction(models.Model):
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='sender')
    receiver = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='receiver')
    amount = models.DecimalField(max_digits=20, decimal_places=6)
    currency = models.CharField(max_length=3)

    objects = models.Manager()
