from django.urls import path
from . import views

urlpatterns = [
    path('users/', views.user_list),
    path('accounts/', views.account_list),
    path('login/', views.login_request)
]