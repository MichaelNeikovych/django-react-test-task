from django.conf.urls import url

from requests.views import (
    user_requests_view,
)

urlpatterns = [
    url(r"^$", user_requests_view, name="requests"),
]
