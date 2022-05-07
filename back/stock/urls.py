from . import views
from django.urls import path

urlpatterns = [
    path('', views.StockListViewSet.as_view())
]