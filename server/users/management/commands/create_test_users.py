from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

from users.models import UserProfile


class Command(BaseCommand):
    def create_user(self, username, password, role):
        user, created = User.objects.get_or_create(username=username)

        if created:
            user.set_password(password)
            user.save()

        profile, created = UserProfile.objects.get_or_create(user=user)

        profile.role = role
        profile.save()

    def handle(self, *args, **options):
        self.create_user(
            username="John", password="admin123", role=UserProfile.ROLE_ADMIN
        )

        self.create_user(
            username="David", password="user123", role=UserProfile.ROLE_USER
        )

        self.stdout.write("Test users created successfully.")
