import json

from django.core import serializers
from rest_framework import viewsets, authentication, status
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Stock
from .serializer import StockSerializer
import requests

stocks = ["AAPL", "MSFT", "AMZN", "TSLA", "GOOGL",
          "BRK-B", "FB", "NVDA", "UNH", "JNJ", "XOM",
          "PG", "JPM", "V", "CVX", "HD", "MA", "PFE",
          "ABBV", "BAC", "KO", "AVGO", "PEP", "LLY",
          "COST", "MRK", "TMO", "WMT", "CSCO", "GME",
          "DIS", "VZ", "NFLX", "ADBE", "ACN", "MCD",
          "INTC", "AMD", "WFC", "CRM", "QCOM", "PM",
          "T", "IBM", "MS"]

top_10_stocks = ["AAPL", "MSFT", "AMZN", "TSLA", "GOOGL",
                 "BRK-B", "FB", "NVDA", "UNH", "JNJ"]
# Create your views here.


class StockViewSet(viewsets.ModelViewSet):
    serializer_class = StockSerializer

    def _get_stock_data(self):
        url = "https://yfapi.net/v6/finance/quote"
        headers = {
            'x-api-key': 'hZICq3u8L43JItubRNv0n6UlzWh4CwzBaroX9RBl'
        }
        querystring = {"symbols": ""}
        for sym in stocks:
            querystring["symbols"] += sym + ","
        response = requests.request("GET", url, headers=headers, params=querystring)
        json_obj = json.loads(response.text)
        return json_obj

    def save_stock_data(self):
        stock_data = self._get_stock_data()
        if stock_data is not None:
            for i in range(len(stocks)):
                stock_entry = stock_data['quoteResponse']['result'][i]
                stock_dict = {'name': stock_entry['longName'], 'symbol': stock_entry['symbol'],
                              'currency': stock_entry['currency'], 'exchange_name': stock_entry['fullExchangeName'],
                              'tradeable': stock_entry['tradeable'], 'ask_price': stock_entry['ask'],
                              'bid_price': stock_entry['bid'], 'market_price': stock_entry['regularMarketPrice'],
                              'market_change': stock_entry['regularMarketChange'],
                              'market_change_percent': stock_entry['regularMarketChangePercent'],
                              'market_cap': stock_entry['marketCap']}
                print(stock_dict)
                serializer = StockSerializer(data=stock_dict)
                if serializer.is_valid():
                    serializer.save()


class StockListViewSet(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        stock_list = Stock.objects.all()
        serializer = StockSerializer(stock_list, many=True)
        return Response(serializer.data)


@api_view(['GET'])
def stock_detail(request, symbol):

    stock = Stock.objects.get(symbol=symbol.upper())
    if stock is None:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = StockSerializer(stock)
        return Response(serializer.data)


@api_view(['GET'])
def stock_name_filter(request):

    if request.method == 'GET':
        param = request.GET.get('q', None)
        if param is not None:
            queryresult = Stock.objects.filter(name__contains=param)
            serializer = serializers.serialize("json", queryresult, fields=('name', 'symbol', 'exchange_name'))
            json_obj = json.loads(serializer)
            return Response(json_obj)
        return Response(status=status.HTTP_400_BAD_REQUEST)