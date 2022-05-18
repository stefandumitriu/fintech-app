from django.http import HttpResponse, JsonResponse
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
        users = CustomUser.objects.all()
        serializer = CustomUserSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = JSONParser().parse(request)
        serializer = CustomUserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response({"error": serializer.errors,
                         "status": status.HTTP_203_NON_AUTHORITATIVE_INFORMATION})


@api_view(['GET'])
def user_detail(request, phone):
    user = CustomUser.objects.get(phone_number=phone)
    if user is None:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CustomUserSerializer(user)
        return Response(serializer.data)


class AccountView(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        email = request.GET.get("user", None)

        if email is None:
            accounts = Account.objects.all()
            #cards = Card.objects.all()
            serializer1 = AccountSerializer(accounts, many=True)
            #serializer2 = CardSerializer(cards, many=True)
            return Response(serializer1.data)
        else:
            user = CustomUser.objects.get(email=email)
            if user is None:
                return Response(status=status.HTTP_404_NOT_FOUND)

            account = Account.objects.filter(owner=user).all()
            #cards = Card.objects.filter(account__owner=user).all()
            if len(account) == 0:
                return JsonResponse([], safe=False)

            serializer = AccountSerializer(account, many=True)
            return Response(serializer.data)

    def post(self, request):
        data = JSONParser().parse(request)
        serializer = AccountSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response({"error": serializer.errors,
                         "status": status.HTTP_203_NON_AUTHORITATIVE_INFORMATION})

class VaultView(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self):
        vaults = Vault.objects.all()
        serializer = VaultSerializer(vaults, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = JSONParser().parse(request)
        serializer = VaultSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response({"error": serializer.errors,
                         "status": status.HTTP_203_NON_AUTHORITATIVE_INFORMATION})


@api_view(['POST'])
def get_card(req):
    data = JSONParser().parse(req)
    serializer = CardSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response({"error": serializer.errors,
                     "status": status.HTTP_203_NON_AUTHORITATIVE_INFORMATION})

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
        return JsonResponse({"token": token.key})
    else:
        return HttpResponse("Login failed", status=400)


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
