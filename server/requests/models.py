from django.contrib.auth.models import User
from django.db import models


class Request(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    execution_date = models.DateField()
    created_by = models.ForeignKey(User, related_name="created_requests")
    created_at = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return self.title
