from .models import CustomUser


def authenticate(username=None, password=None):
	try:
		user = CustomUser.objects.get(user_name=username)
		if user.password == password:
			return user
	except CustomUser.DoesNotExist:
		return None


def get_user(username):
	try:
		user = CustomUser.objects.get(user_name=username)
		if user.is_active:
			return user
		return None
	except CustomUser.DoesNotExist:
		return None