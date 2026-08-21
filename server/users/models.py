from django.contrib.auth.models import User
from django.db import models


class UserProfile(models.Model):
    ROLE_ADMIN = "admin"
    ROLE_USER = "user"

    ROLE_CHOICES = (
        (ROLE_ADMIN, "Admin"),
        (ROLE_USER, "User"),
    )

    user = models.OneToOneField(User, related_name="profile")

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    def __unicode__(self):
        return self.user.username
