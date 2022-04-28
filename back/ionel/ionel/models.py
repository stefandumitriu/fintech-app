from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from django.db import models

# Create your models here.
class UserManager(BaseUserManager):
    def create_user(self, username, first_name, last_name, email, birthdate, address, phone_number, password=None):
        """
        Creates and saves a User with the given credential
        """
        if not username:
            raise ValueError('Users must have an username')
        if not email:
            raise ValueError('Users must have an email')

        user = self.model(
            user_name=username,
            first_name=first_name,
            last_name=last_name,
            email=email,
            birthdate=birthdate,
            address=address,
            phone_number=phone_number,
            user_type=user_type,
            auth_seed=random.randint(1, 999999999),
        )
        user.set_password(password)
        user.save(using=self._db)
        return  user

    def create_admin(self, username, first_name, last_name, email, birthdate, address, phone_number, password=None):
        """
        Creates and saves a admin with the given credential
        """
        user = self.create_user(
        user_name=username,
        first_name=first_name,
        last_name=last_name,
        email=email,
        birthdate=birthdate,
        address=address,
        phone_number=phone_number,
        is_staff=True,
        password=password,
        )
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
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['user_name', 'first_name', 'last_name', 'phone_number']

    objects = UserManager()

    def get_full_name(self):
        return self.first_name + ' ' + self.last_name

    def get_short_name(self):
        return self.first_name

    def __str__(self):
        return self.username

    @property
    def is_staff(self):
        return self.is_staff == True


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
    owner = models.ForeignKey(CustomUser)
    balance = models.DecimalField(max_digits=20, decimal_places=6)
    currency = models.CharField(max_length=3)
    creation_time = models.DateTimeField('creation date', auto_now_add=True)
    last_updated_time = models.DateTimeField('last updated date', auto_now=True)