from datetime import datetime
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
from rest_framework.authtoken.models import Token

from .models import Transaction, ExternalTransaction
from .serializer import TransactionSerializer, ExternalTransactionSerializer
from user.models import Account, CustomUser

from ionel import settings


class TransactionView(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_param = request.GET.get('user')
        if user_param is not None:
            try:
                user = CustomUser.objects.get(email=user_param)
            except:
                return Response(status=status.HTTP_404_NOT_FOUND)
            auth_user = Token.objects.get(key=request.auth).user
            if user != auth_user:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
            queryresult = Transaction.objects.order_by('-timestamp').filter(Q(sender__email__contains=user_param)
                                                     | Q(receiver__email__contains=user_param))
            from_date = request.GET.get('from')
            to_date = request.GET.get('to')
            if from_date is not None:
                from_date_formatted = datetime.strptime(from_date, "%d-%m-%Y")
                queryresult = queryresult.filter(
                    timestamp__gte=datetime(from_date_formatted.year, from_date_formatted.month,
                                            from_date_formatted.day))
            if to_date is not None:
                to_date_formatted = datetime.strptime(to_date, "%d-%m-%Y")
                queryresult = queryresult.filter(
                    timestamp__lte=datetime(to_date_formatted.year, to_date_formatted.month, to_date_formatted.day))
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


class ExternalTransactionView(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_param = request.GET.get('user')
        if user_param is not None:
            try:
                user = CustomUser.objects.get(email=user_param)
            except:
                return Response(status=status.HTTP_404_NOT_FOUND)
            auth_user = Token.objects.get(key=request.auth).user
            if user != auth_user:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
            queryresults = ExternalTransaction.objects.order_by('-timestamp').filter(client__email__contains=user_param)
            from_date = request.GET.get('from')
            to_date = request.GET.get('to')
            if from_date is not None:
                from_date_formatted = datetime.strptime(from_date, "%d-%m-%Y")
                queryresults = queryresults.filter(
                    timestamp__gte=datetime(from_date_formatted.year, from_date_formatted.month, from_date_formatted.day))
            if to_date is not None:
                to_date_formatted = datetime.strptime(to_date, "%d-%m-%Y")
                queryresults = queryresults.filter(
                    timestamp__lte=datetime(to_date_formatted.year, to_date_formatted.month, to_date_formatted.day))
            serializer = ExternalTransactionSerializer(queryresults, many=True)
            return Response(serializer.data)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        data = JSONParser().parse(request)
        serializer = ExternalTransactionSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            client_accounts = Account.objects.filter(owner__email__contains=serializer.data['client'], acc_type="card"|"CARD"|"current")
            account_with_needed_currency = client_accounts.filter(currency__contains=serializer.data['currency'])
            if account_with_needed_currency.exists():
                if serializer.data['type'] == 'OUTGOING':
                    Account.objects.filter(id=account_with_needed_currency[0].id).update(
                        balance=F('balance') - serializer.data['amount'])
                else:
                    Account.objects.filter(id=account_with_needed_currency[0].id).update(
                        balance=F('balance') + serializer.data['amount'])
            else:
                if serializer.data['type'] == 'OUTGOING':
                    acc = Account.objects.get(id=client_accounts[0].id)
                    acc.balance -= exchange(serializer.data['currency'], acc.currency, serializer.data['amount'])
                    acc.save()
                else:
                    acc = Account.objects.get(id=client_accounts[0].id)
                    acc.balance += exchange(serializer.data['currency'], acc.currency, serializer.data['amount'])
                    acc.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)


class SavingsTransactionView(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_param = request.GET.get('user')
        if user_param is not None:
            try:
                user = CustomUser.objects.get(email=user_param)
            except:
                return Response(status=status.HTTP_404_NOT_FOUND)
            auth_user = Token.objects.get(key=request.auth).user
            if user != auth_user:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
            queryresult = Transaction.objects.order_by('-timestamp').filter(Q(sender__email__contains=user_param)
                                                     | Q(receiver__email__contains=user_param))
            from_date = request.GET.get('from')
            to_date = request.GET.get('to')
            if from_date is not None:
                from_date_formatted = datetime.strptime(from_date, "%d-%m-%Y")
                queryresult = queryresult.filter(
                    timestamp__gte=datetime(from_date_formatted.year, from_date_formatted.month,
                                            from_date_formatted.day))
            if to_date is not None:
                to_date_formatted = datetime.strptime(to_date, "%d-%m-%Y")
                queryresult = queryresult.filter(
                    timestamp__lte=datetime(to_date_formatted.year, to_date_formatted.month, to_date_formatted.day))
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
            sender_accounts = Account.objects.filter(owner__email__contains=serializer.data['sender'], acc_type="SVG")
            account_with_needed_currency = sender_accounts.filter(currency__contains=serializer.data['currency'])
            if account_with_needed_currency.exists():
                if account_with_needed_currency[0].deadline_date <= datetime.now() or account_with_needed_currency[0].goal < account_with_needed_currency[0].balance:
                    Account.objects.filter(id=account_with_needed_currency[0].id).update(
                        balance=F('balance') - serializer.data['amount'])
                else:
                    return Response({"error": serializer.errors,
                                     "status": status.HTTP_400_BAD_REQUEST})
            else:
                acc = Account.objects.get(id=sender_accounts[0].id, acc_type="SVG")
                if acc.deadline_date <= datetime.now() or acc.goal < acc.balance:
                    acc.balance -= exchange(serializer.data['currency'], acc.currency, serializer.data['amount'])
                    acc.save()
                else:
                    return Response({"error": serializer.errors,
                                     "status": status.HTTP_400_BAD_REQUEST})
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