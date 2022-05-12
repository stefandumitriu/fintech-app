import decimal
import json

import requests
from django.db.models import Q, F
# Create your views here.
from rest_framework import authentication, status
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Transaction
from .serializer import TransactionSerializer
from user.models import Account


class TransactionView(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_param = request.GET.get('user')
        if user_param is not None:
            queryresult = Transaction.objects.filter(Q(sender__email__contains=user_param)
                                                     | Q(receiver__email__contains=user_param))
            serializer = TransactionSerializer(queryresult, many=True)
            return Response(serializer.data)
        transactions = Transaction.objects.all()
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = JSONParser().parse(request)
        serializer = TransactionSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            sender_accounts = Account.objects.filter(owner__email__contains=serializer.data['sender'])
            account_with_needed_currency = sender_accounts.filter(currency__contains=serializer.data['currency'])
            if account_with_needed_currency.exists():
                Account.objects.filter(id=account_with_needed_currency[0].id).update(balance=F('balance') - serializer.data['amount'])
            else:
                acc = Account.objects.get(id=sender_accounts[0].id)
                acc.balance -= exchange(serializer.data['currency'], acc.currency, serializer.data['amount'])
                acc.save()
            receiver_accounts = Account.objects.filter(owner__email__contains=serializer.data['receiver'])
            account_with_needed_currency = receiver_accounts.filter(currency__contains=serializer.data['currency'])
            if account_with_needed_currency.exists():
                Account.objects.filter(id=account_with_needed_currency[0].id).update(
                    balance=F('balance') + serializer.data['amount'])
            else:
                acc = Account.objects.get(id=receiver_accounts[0].id)
                acc.balance += exchange(serializer.data['currency'], acc.currency, serializer.data['amount'])
                acc.save()
            return Response(serializer.data)
        return Response({"error": serializer.errors,
                         "status": status.HTTP_203_NON_AUTHORITATIVE_INFORMATION})


def exchange(from_currency, to_currency, amount):

    url = f"https://api.apilayer.com/exchangerates_data/convert?to={to_currency}&from={from_currency}&amount={amount}"

    payload = {}
    headers = {
        "apikey": "6LnKNclG2tnGHc4cFHsSArKaKL3YjxH6"
    }

    response = requests.request("GET", url, headers=headers, data=payload)

    if response.status_code == 200:
        json_obj = json.loads(response.text)
        return decimal.Decimal(json_obj['result'])