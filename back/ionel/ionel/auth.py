from .models import CustomUser

class UserAuthentication(object):
	def authenticate(self, username=None, password=None):
		try:
			user = CustomUser.objects.get(user_name=username)
			if user.check_password(password):
				return user
		except CustomUser.DoesNotExist:
			return None

	def get_user(self, username):
		try:
			user = CustomUser.objects.get(user_name=username)
			if user.is_active:
				return user
			return None
		except CustomUser.DoesNotExist:
			return None