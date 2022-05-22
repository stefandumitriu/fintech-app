from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    path('users/', views.UserView.as_view()),
    path('accounts/', views.AccountView.as_view()),
    path('login/', views.login_request),
    path('vaults/', views.VaultView.as_view()),
    path('users/<str:phone>', views.user_detail),
    path('exchange/', views.convert_amount),
    path('get_card/', views.get_card),
    path('accounts/statement/', views.AccountStatementView.as_view())
]

urlpatterns = format_suffix_patterns(urlpatterns)
