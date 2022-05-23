from rest_framework import serializers
from .models import Stock, StockAccount
from user.models import CustomUser

class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = ["name", "symbol", "currency", "exchange_name",
                  "tradeable", "ask_price", "bid_price", "market_price",
                  "market_change", "market_change_percent", "market_cap"]


class StockAccountSerializer(serializers.ModelSerializer):

    def total_value_func(self, obj):
        return obj.quantity * obj.stock.market_price

    total_value = serializers.SerializerMethodField('total_value_func', read_only=True)
    stock = serializers.SlugRelatedField(many=False, read_only=False, queryset=Stock.objects.all(),
                                              slug_field='symbol')
    owner = serializers.SlugRelatedField(many=False, read_only=False, queryset=CustomUser.objects.all(),
                                               slug_field='email')

    class Meta:
        model = StockAccount
        fields = ['owner', 'stock', 'quantity', 'total_value']