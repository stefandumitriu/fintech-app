from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import authentication, status
from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import CustomUser, Account
from .serializers import CustomUserSerializer, AccountSerializer
from .auth import authenticate
from rest_framework.authtoken.models import Token

# Create your views here.


class UserView(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [IsAuthenticated]

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
        accounts = Account.objects.all()
        serializer = AccountSerializer(accounts, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = JSONParser().parse(request)
        serializer = AccountSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response({"error": serializer.errors,
                        "status": status.HTTP_203_NON_AUTHORITATIVE_INFORMATION})

# @csrf_exempt
# def account_list(req):
#     if req.method == 'GET':
#         accounts = Account.objects.all()
#         serializer = AccountSerializer(accounts, many=True)
#         return JsonResponse(serializer.data, safe=False)
#
#     elif req.method == 'POST':
#         data = JSONParser().parse(req)
#         serializer = AccountSerializer(data=data)
#         if serializer.is_valid():
#             serializer.save()
#             return JsonResponse(serializer.data, status=201)
#         return JsonResponse(serializer.data, status=400)


@csrf_exempt
def login_request(req):
    data = JSONParser().parse(req)
    user_name = data['user_name']
    password = data['password']
    user = authenticate(username=user_name, password=password)
    if user is not None:
        token, created = Token.objects.get_or_create(user=user)
        print(str(token.key))
        return JsonResponse({"token": token.key})
    else:
        return HttpResponse("Login failed", status=400)
