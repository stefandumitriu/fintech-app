from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from .models import CustomUser, Account
from .serializers import CustomUserSerializer, AccountSerializer
from .auth import authenticate

# Create your views here.


@csrf_exempt
def user_list(req):
    if req.method == 'GET':
        users = CustomUser.objects.all()
        serializer = CustomUserSerializer(users, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif req.method == 'POST':
        data = JSONParser().parse(req)
        serializer = CustomUserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)


@csrf_exempt
def account_list(req):
    if req.method == 'GET':
        accounts = Account.objects.all()
        serializer = AccountSerializer(accounts, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif req.method == 'POST':
        data = JSONParser().parse(req)
        serializer = AccountSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.data, status=405)

@csrf_exempt
def login_request(req):
    data = JSONParser().parse(req)
    user_name = data['user_name']
    password = data['password']
    user = authenticate(username=user_name, password=password)
    if user is not None:
        return HttpResponse("Login successful", status=201)
    else:
        return HttpResponse("Login failed", status=400)
