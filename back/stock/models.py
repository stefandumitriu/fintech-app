from django.db import models
from user.models import CustomUser

# Create your models here.


class Stock(models.Model):
    name = models.CharField(max_length=100)
    symbol = models.CharField(unique=True, max_length=10)
    currency = models.CharField(max_length=3)
    exchange_name = models.CharField(max_length=100)
    tradeable = models.BooleanField(default=False)
    ask_price = models.FloatField()
    bid_price = models.FloatField()
    market_price = models.FloatField()
    market_change = models.FloatField()
    market_change_percent = models.FloatField()
    market_cap = models.BigIntegerField()

    objects = models.Manager()


class StockAccount(models.Model):
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    quantity = models.FloatField()

    objects = models.Manager()
