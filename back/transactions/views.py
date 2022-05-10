from django.db.models import Q
from django.shortcuts import render

# Create your views here.
from rest_framework import authentication, status
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Transaction
from .serializer import TransactionSerializer


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
            return Response(serializer.data)
        return Response({"error": serializer.errors,
                         "status": status.HTTP_203_NON_AUTHORITATIVE_INFORMATION})
