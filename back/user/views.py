import io
from datetime import date
from dateutil.relativedelta import relativedelta
from django.contrib.auth.hashers import make_password
from reportlab.pdfgen import canvas

from django.http import HttpResponse, JsonResponse, FileResponse
from django.utils import timezone, dateformat
from django.views.decorators.csrf import csrf_exempt
from rest_framework import authentication, status, permissions
from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import CustomUser, Account, Vault, Card
from .serializers import CustomUserSerializer, AccountSerializer, VaultSerializer, CardSerializer
from .auth import authenticate
from rest_framework.authtoken.models import Token
from rest_condition import And, Or, Not
import requests
import json


# Create your views here.


class IsPostRequest(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.method == 'POST'


class UserView(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [Or(IsPostRequest, IsAuthenticated)]

    def get(self, request):
        return Response("Not allowed to get this resource", status=status.HTTP_403_FORBIDDEN)

    def post(self, request):
        data = JSONParser().parse(request)
        data['password'] = make_password(data['password'])
        serializer = CustomUserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def user_detail(request, phone):
    user = CustomUser.objects.get(phone_number=phone)
    if user is None:
        return Response(status=status.HTTP_404_NOT_FOUND)
    request_user = Token.objects.get(key=request.auth).user
    if user != request_user:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    if request.method == 'GET':
        serializer = CustomUserSerializer(user)
        return Response(serializer.data)


class AccountView(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        auth_user = Token.objects.get(key=request.auth).user
        if auth_user is not None:
            account = Account.objects.filter(owner=auth_user).all()
            if len(account) == 0:
                return JsonResponse([], safe=False)
            serializer = AccountSerializer(account, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        data = JSONParser().parse(request)
        serializer = AccountSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VaultView(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self):
        vaults = Vault.objects.all()
        serializer = VaultSerializer(vaults, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data = JSONParser().parse(request)
        serializer = VaultSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AccountStatementView(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        range = request.GET.get('range')
        account_currency = request.GET.get('currency')
        auth_user = Token.objects.get(key=request.auth).user
        account = Account.objects.filter(owner=auth_user).filter(currency=account_currency)
        from_date = None
        if range is not None:
            if range == '1m':
                from_date = date.today() + relativedelta(months=-1)
            elif range == '3m':
                from_date = date.today() + relativedelta(months=-3)
            elif range == '6m':
                 from_date = date.today() + relativedelta(months=-6)
            else:
                from_date = None
        buffer = io.BytesIO()

        p = canvas.Canvas(buffer)
        p.drawString(200, 800, "Account Statement")
        p.drawString(50, 760, "Owner Name: " + auth_user.first_name + " " + auth_user.last_name)
        p.drawString(50, 740, "Account IBAN: " + account[0].iban)
        p.drawString(50, 720, "Account Currency: " + account[0].currency)
        p.drawString(50, 700, "Generated on: " + date.today().strftime('%d-%m-%Y'))

        if from_date is not None:
            p.drawString(160, 660, "Showing transactions from: " + from_date.strftime("%d-%m-%Y"))
            json_data = json.loads(get_user_transactions(auth_user.email,
                                     from_date.strftime("%d-%m-%Y"), date.today().strftime('%d-%m-%Y'), request.auth).text)
            yCursor = 620
            for json_obj in json_data:
                amount = json_obj['amount']
                p.drawString(50, yCursor, json_obj['sender'] + "  ->  " + json_obj['receiver'])
                if json_obj['sender'] == auth_user.email:
                    p.drawString(400, yCursor, "-" + amount + " " + json_obj['currency'])
                else:
                    p.drawString(400, yCursor, amount + " " + json_obj['currency'])
                p.drawString(400, yCursor - 20, json_obj['timestamp'])
                p.line(50, yCursor - 40, 500, yCursor - 40)
                yCursor -= 60

            external_json_data = json.loads(get_user_transactions_external(auth_user.email,
                                     from_date.strftime("%d-%m-%Y"), date.today().strftime('%d-%m-%Y'), request.auth).text)
            for json_obj in external_json_data:
                if json_obj['type'] == 'OUTGOING':
                    p.drawString(50, yCursor, json_obj['client'] + "  ->  " + json_obj['external_peer'])
                    p.drawString(400, yCursor, "-" + json_obj['amount'] + " " + json_obj['currency'])
                else:
                    p.drawString(50, yCursor, json_obj['external_peer'] + "  ->  " + json_obj['client'])
                    p.drawString(400, yCursor, json_obj['amount'] + " " + json_obj['currency'])
                p.drawString(400, yCursor - 20, json_obj['timestamp'])
                p.line(50, yCursor - 40, 500, yCursor - 40)
                yCursor -= 60
        p.showPage()
        p.save()

        buffer.seek(0)
        return FileResponse(buffer, as_attachment=True, filename='acc_statement.pdf')


@api_view(['POST'])
def get_card(req):
    data = JSONParser().parse(req)
    serializer = CardSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
def login_request(req):
    data = JSONParser().parse(req)
    phone_number = data['phone_number']
    password = data['password']
    user = authenticate(phone_number=phone_number, password=password)
    if user is not None:
        token, created = Token.objects.get_or_create(user=user)
        user.last_login = str(timezone.now().strftime("%Y-%m-%d %H:%M:%S"))
        user.save()
        return JsonResponse({"token": token.key,
                             "email": user.email}, status=status.HTTP_200_OK)
    else:
        return HttpResponse("Login failed", status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def convert_amount(req):
    data = JSONParser().parse(req)
    base_currency = data['base_currency']
    to_currency = data['to_currency']
    amount = data['amount']
    url = f"https://api.apilayer.com/exchangerates_data/convert?to={to_currency}&from={base_currency}&amount={amount}"

    payload = {}
    headers = {
        "apikey": "6LnKNclG2tnGHc4cFHsSArKaKL3YjxH6"
    }

    response = requests.request("GET", url, headers=headers, data=payload)

    if response.status_code == 200:
        json_obj = json.loads(response.text)
        return JsonResponse({"base_currency": json_obj["query"]["from"],
                             "to_currency": json_obj["query"]["to"],
                             "amount": json_obj["query"]["amount"],
                             "result": json_obj["result"]})
    else:
        return response


def get_user_transactions(email, from_date, to_date, token):

    url = f"http://3.70.21.159:8000/transactions/?user={email}&from={from_date}&to={to_date}"
    headers = {
        "Authorization": f"Token {token}"
    }

    response = requests.request("GET", url, headers=headers, data={})
    return response


def get_user_transactions_external(email, from_date, to_date, token):

    url = f"http://3.70.21.159:8000/transactions/external/?user={email}&from={from_date}&to={to_date}"
    headers = {
        "Authorization": f"Token {token}"
    }

    response = requests.request("GET", url, headers=headers, data={})
    return response


