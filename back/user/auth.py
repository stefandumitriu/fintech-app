from django.contrib.auth.hashers import check_password, make_password

from .models import CustomUser


def authenticate(phone_number=None, password=None):
	try:
		user = CustomUser.objects.get(phone_number=phone_number)
		if check_password(password, user.password):
			return user
		return None
	except CustomUser.DoesNotExist:
		return None


def get_user(phone_number):
	try:
		user = CustomUser.objects.get(phone_number=phone_number)
		if user.is_active:
			return user
		return None
	except CustomUser.DoesNotExist:
		return None