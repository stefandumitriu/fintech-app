from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin, UserManager, Group, Permission
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from django.db import models


class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        """
        Creates and saves a User with the given credential
        """
        if not username:
            raise ValueError('Users must have an username')

        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_admin(self, username, email, password=None, **extra_fields):
        """
        Creates and saves a admin with the given credential
        """
        extra_fields.setdefault('is_staff', True)
        user = self.model(username=username, email=email, **extra_fields)
        user.save(using=self._db)
        return user


class CustomUser(AbstractBaseUser, PermissionsMixin):
    user_name = models.CharField(_('username'), max_length=50, unique=True)
    email = models.EmailField(_('email address'), unique=True)
    first_name = models.CharField(_('first name'), max_length=150)
    last_name = models.CharField(_('last name'), max_length=150)
    birthdate = models.DateTimeField(_('birthdate'), default=timezone.now)
    address = models.CharField(_('home address'), max_length=300, blank=True)
    phone_number = models.CharField(_('phone number'), max_length=12, unique=True)
    is_active = models.BooleanField(default=False)
    groups = models.ManyToManyField(Group, related_name='user_role')
    user_permissions = models.ManyToManyField(Permission, related_name='user_perm')
    last_login = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = 'user_name'
    REQUIRED_FIELDS = ['email', 'first_name', 'last_name', 'phone_number']

    objects = CustomUserManager()

    def get_full_name(self):
        return self.first_name + ' ' + self.last_name

    def get_short_name(self):
        return self.first_name

    def __str__(self):
        return self.user_name


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
    balance = models.DecimalField(max_digits=20, decimal_places=6)
    currency = models.CharField(max_length=3)
    creation_time = models.DateTimeField('creation date', auto_now_add=True)
    last_updated_time = models.DateTimeField('last updated date', auto_now=True)

    objects = models.Manager()

