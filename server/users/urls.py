from django.conf.urls import url

from users.views import (
    current_user_view,
    login_view,
    logout_view,
)

urlpatterns = [
    url(r"^login/$", login_view, name="login"),
    url(r"^me/$", current_user_view, name="current-user"),
    url(r"^logout/$", logout_view, name="logout"),
]
