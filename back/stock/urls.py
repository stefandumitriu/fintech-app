from rest_framework.urlpatterns import format_suffix_patterns

from . import views
from django.urls import path

urlpatterns = [
    path('', views.StockListViewSet.as_view()),
    path('<str:symbol>', views.stock_detail),
    path('search/', views.stock_name_filter),
    path('account/', views.StockAccountViewSet.as_view())
]

urlpatterns = format_suffix_patterns(urlpatterns)