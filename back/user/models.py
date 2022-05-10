from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin, UserManager, Group, Permission
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from django.db import models


class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_('email address'), unique=True)
    first_name = models.CharField(_('first name'), max_length=150)
    last_name = models.CharField(_('last name'), max_length=150)
    age = models.IntegerField(_('age'))
    address = models.CharField(_('home address'), max_length=300, blank=True)
    phone_number = models.CharField(_('phone number'), max_length=12, unique=True, blank=False)
    is_active = models.BooleanField(default=False)
    groups = models.ManyToManyField(Group, related_name='user_role')
    user_permissions = models.ManyToManyField(Permission, related_name='user_perm')
    last_login = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'email']

    objects = models.Manager()

    def get_full_name(self):
        return self.first_name + ' ' + self.last_name

    def get_short_name(self):
        return self.first_name

    def __str__(self):
        return self.email


class Account(models.Model):
    CURRENT = 'CUR'
    SAVINGS = 'SVG'
    ACCOUNT_TYPE_CHOICES = (
            (CURRENT, 'Current'),
            (SAVINGS, 'Savings'),
    )
    iban = models.CharField(max_length=34, unique=True)
    acc_type = models.CharField(
            max_length=3,
            choices=ACCOUNT_TYPE_CHOICES,
            default=CURRENT,
    )
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    balance = models.DecimalField(max_digits=20, decimal_places=2)
    currency = models.CharField(max_length=3)
    creation_time = models.DateTimeField('creation date', auto_now_add=True)
    last_updated_time = models.DateTimeField('last updated date', auto_now=True)

    objects = models.Manager()


class Vault(models.Model):
    name = models.CharField(max_length=30)
    goal = models.DecimalField(max_digits=20, decimal_places=2)
    deadline_date = models.DateTimeField()
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    balance = models.DecimalField(max_digits=20, decimal_places=2, default=0)

    objects = models.Manager()

    def deposit(self, account, amount):
        user_account = Account.objects.get(account)
        if user_account.balance >= amount:
            self.balance += amount
            user_account.balance -= amount

    def withdraw(self):
        if self.goal <= self.balance or self.deadline_date < timezone.now():
            return Vault.objects.pop(self)
