from rest_framework import serializers
from .models import Stock


class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = ["name", "symbol", "currency", "exchange_name",
                  "tradeable", "ask_price", "bid_price", "market_price",
                  "market_change", "market_change_percent", "market_cap"]