import datetime
from django.utils.crypto import get_random_string

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
    is_active = models.BooleanField(default=True)
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
    CARD = 'CARD'
    ACCOUNT_TYPE_CHOICES = (
            (CURRENT, 'Current'),
            (SAVINGS, 'Savings'),
            (CARD, 'CARD')
    )
    iban = models.CharField(max_length=34, unique=True)
    acc_type = models.CharField(
            max_length=8,
            choices=ACCOUNT_TYPE_CHOICES,
            default=CURRENT,
    )
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    balance = models.DecimalField(max_digits=20, decimal_places=2)
    currency = models.CharField(max_length=3)
    creation_time = models.DateTimeField(auto_now=True)
    last_updated_time = models.DateTimeField(auto_now=True)
    card_expiration_date = models.DateTimeField(null=True)
    card_number = models.CharField(max_length=16, unique=True, null=True)
    deadline_date = models.DateTimeField(null=True)
    goal = models.DecimalField(max_digits=20, decimal_places=2, default=0)

    objects = models.Manager()

    def save(self, *args, **kwargs):
        self.iban = "RO" + get_random_string(length=2, allowed_chars='1234567890') + "IONE" + \
                    get_random_string(length=16, allowed_chars='1234567890')
        if self.acc_type == self.CARD:
            self.card_expiration_date = datetime.datetime.now() + datetime.timedelta(days=1461)
            self.card_number = get_random_string(length=16, allowed_chars='1234567890')
        if self.deadline_date is None and self.acc_type == self.SAVINGS or self.acc_type == 'Savings':
            self.deadline_date = datetime.datetime.now() + datetime.timedelta(days=90)
            self.goal = 1500
        super(Account, self).save(*args, **kwargs)


class Card(models.Model):
    account = models.OneToOneField(
        Account,
        on_delete=models.CASCADE
    )
    card_expiration_date = models.DateTimeField(null=True)
    card_number = models.CharField(max_length=16, unique=True)

    objects = models.Manager()

    def save(self, *args, **kwargs):
        self.card_expiration_date = self.account.creation_time + datetime.timedelta(days=1461)
        super(Card, self).save(*args, **kwargs)


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
