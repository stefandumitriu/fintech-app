import json

from django.core import serializers
from rest_framework import viewsets, authentication, status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Stock, StockAccount
from .serializer import StockSerializer, StockAccountSerializer
from user.models import Account
from transactions.views import exchange
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


class StockAccountViewSet(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, req):
        auth_user = Token.objects.get(key=req.auth).user
        if auth_user is not None:
            stocks_owned = StockAccount.objects.filter(owner=auth_user)
            serializer = StockAccountSerializer(stocks_owned, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    def post(self, req):
        auth_user = Token.objects.get(key=req.auth).user
        json_data = json.loads(req.body)
        stock_owned = StockAccount.objects.filter(owner=auth_user).filter(stock__symbol=json_data['symbol']).first()
        if not stock_owned and json_data['operation'] == 'buy':
            serializer = StockAccountSerializer(data={'owner': auth_user.email, 'stock': json_data['symbol'],
                                                      'quantity': json_data['quantity']})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        elif not stock_owned and json_data['operation'] == 'sell':
            return Response({'error': 'You don\'t own this stock!'},
                            status=status.HTTP_400_BAD_REQUEST)
        elif json_data['operation'] == 'buy':
            user_account = Account.objects.filter(owner=auth_user).filter(currency='USD').first()
            if not user_account:
                user_account = Account.objects.filter(owner=auth_user).first()
                converted_amount = exchange('USD', user_account.currency,
                                            json_data['quantity'] * stock_owned.stock.ask_price)
                if user_account.balance < converted_amount:
                    return Response({'error': 'Not enough balance in your account!'},
                                    status=status.HTTP_400_BAD_REQUEST)
            else:
                if user_account.balance < json_data['quantity'] * stock_owned.stock.ask_price:
                    return Response({'error': 'Not enough balance in your account!'},
                                    status=status.HTTP_400_BAD_REQUEST)
            serializer = StockAccountSerializer(stock_owned,
                                                data={'quantity': stock_owned.quantity + json_data['quantity']},
                                                partial=True)
            make_stock_order(auth_user.email, json_data['quantity'] * stock_owned.stock.ask_price,
                             'OUTGOING', req.auth)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
        elif json_data['operation'] == 'sell':
            if json_data['quantity'] > stock_owned.quantity:
                return Response({'error': 'Not enough stock quantity'},
                                status=status.HTTP_400_BAD_REQUEST)
            serializer = StockAccountSerializer(stock_owned,
                                                data={'quantity': stock_owned.quantity - json_data['quantity']},
                                                partial=True)
            make_stock_order(auth_user.email, json_data['quantity'] * stock_owned.stock.bid_price,
                             'INCOMING', req.auth)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)






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


def make_stock_order(email, amount, type, token):

    url = f"http://127.0.0.1:8000/transactions/external/"
    headers = {
        "Authorization": f"Token {token}"
    }
    response = requests.post(url, headers=headers, json={
        'client': email,
        'amount': amount,
        'currency': 'USD',
        'type': type,
        'external_peer': 'Ionel Broker'})
    return response
