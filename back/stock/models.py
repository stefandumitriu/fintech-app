from django.db import models

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


