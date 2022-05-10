from . import views
from django.urls import path

urlpatterns = [
    path('', views.TransactionView.as_view()),
]