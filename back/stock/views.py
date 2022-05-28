import json
import time

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


def _get_stock_data():
    url = "https://yfapi.net/v6/finance/quote"
    headers = {
        'x-api-key': 'VDxW3SmOhC9ZhRThKnnJA9rHYzHBc0ru4lAzRUst'
    }
    querystring = {"symbols": ""}
    for sym in stocks:
        querystring["symbols"] += sym + ","
    response = requests.request("GET", url, headers=headers, params=querystring)
    json_obj = json.loads(response.text)
    return json_obj


def save_stock_data():
    stock_data = _get_stock_data()
    if stock_data is not None:
        for i in range(len(stocks)):
            stock_entry = stock_data['quoteResponse']['result'][i]
            stock = Stock.objects.get(symbol=stock_entry['symbol'])
            ask_price = (stock_entry['regularMarketPrice'] * 101 / 100 if stock_entry['ask'] == 0 else stock_entry['ask'])
            bid_price = (stock_entry['regularMarketPrice'] * 99 / 100 if stock_entry['bid'] == 0 else stock_entry['bid'])
            serializer = StockSerializer(stock, data={
                'name': stock_entry['longName'],
                'currency': stock_entry['currency'], 'exchange_name': stock_entry['fullExchangeName'],
                'tradeable': stock_entry['tradeable'], 'ask_price': ask_price,
                'bid_price': bid_price, 'market_price': stock_entry['regularMarketPrice'],
                'market_change': stock_entry['regularMarketChange'],
                'market_change_percent': stock_entry['regularMarketChangePercent'],
                'market_cap': stock_entry['marketCap']
            }, partial=True)
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
        if not stock_owned and json_data['operation'] == 'sell':
            return Response({'error': 'You don\'t own this stock!'},
                            status=status.HTTP_400_BAD_REQUEST)
        elif json_data['operation'] == 'buy':
            user_account = Account.objects.filter(owner=auth_user).filter(currency='USD').first()
            if not user_account:
                user_account = Account.objects.filter(owner=auth_user).first()
                converted_amount = exchange('USD', user_account.currency,
                                            json_data['quantity'] * Stock.objects.get(symbol=json_data['symbol']).ask_price)
                if user_account.balance < converted_amount:
                    return Response({'error': 'Not enough balance in your account!'},
                                    status=status.HTTP_400_BAD_REQUEST)
            else:
                if user_account.balance < json_data['quantity'] * stock_owned.stock.ask_price:
                    return Response({'error': 'Not enough balance in your account!'},
                                    status=status.HTTP_400_BAD_REQUEST)
            if not stock_owned:
                serializer = StockAccountSerializer(data={'owner': auth_user.email, 'stock': json_data['symbol'],
                                                          'quantity': json_data['quantity']})
            else:
                serializer = StockAccountSerializer(stock_owned,
                                                data={'quantity': stock_owned.quantity + json_data['quantity']},
                                                partial=True)
            if serializer.is_valid():
                serializer.save()
                make_stock_order(auth_user.email,
                                 round(json_data['quantity'] * Stock.objects.get(symbol=json_data['symbol']).ask_price, 2),
                                 'OUTGOING', req.auth)
                return Response(serializer.data, status=status.HTTP_200_OK)
        elif json_data['operation'] == 'sell':
            if json_data['quantity'] > stock_owned.quantity:
                return Response({'error': 'Not enough stock quantity'},
                                status=status.HTTP_400_BAD_REQUEST)
            serializer = StockAccountSerializer(stock_owned,
                                                data={'quantity': stock_owned.quantity - json_data['quantity']},
                                                partial=True)
            if serializer.is_valid():
                serializer.save()
                make_stock_order(auth_user.email,
                                 round(json_data['quantity'] * Stock.objects.get(symbol=json_data['symbol']).bid_price, 2),
                                 'INCOMING', req.auth)
                if StockAccount.objects.filter(owner=auth_user).get(stock__symbol=json_data['symbol']).quantity == 0:
                    StockAccount.objects.filter(owner=auth_user).get(stock__symbol=json_data['symbol']).delete()
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
def stock_history(request, symbol):
    data = {}

    url = f"https://yfapi.net/v8/finance/chart/{symbol}?range=3mo&interval=1wk"
    headers = {
        'x-api-key': 'VDxW3SmOhC9ZhRThKnnJA9rHYzHBc0ru4lAzRUst'
    }
    response = requests.request("GET", url, headers=headers)
    json_obj = json.loads(response.text)
    data['date'] = []
    for timestamps in json_obj['chart']['result'][0]['timestamp']:
        data['date'].append(time.strftime('%m-%d-%Y', time.localtime(timestamps)))
    data['price'] = json_obj['chart']['result'][0]['indicators']['quote'][0]['close']
    return Response(json.loads(json.dumps(data)), status=status.HTTP_200_OK)


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

    url = f"http://3.70.21.159:8000/transactions/external/"
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
