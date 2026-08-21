import json

from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


def current_user_view(request):
    if not request.user.is_authenticated():
        return JsonResponse({"detail": "Authentication required"}, status=401)

    return JsonResponse(
        {
            "user": {
                "id": request.user.id,
                "username": request.user.username,
                "role": request.user.profile.role,
            }
        }
    )


@csrf_exempt
def login_view(request):
    if request.method != "POST":
        return JsonResponse({"detail": "Method not allowed"}, status=405)

    try:
        data = json.loads(request.body)
    except (TypeError, ValueError):
        return JsonResponse({"detail": "Invalid JSON"}, status=400)

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return JsonResponse(
            {"detail": "Username and password are required"}, status=400
        )

    user = authenticate(username=username, password=password)

    if user is None:
        return JsonResponse({"detail": "Invalid username or password"}, status=401)

    login(request, user)

    return JsonResponse(
        {
            "user": {
                "id": user.id,
                "username": user.username,
                "role": user.profile.role,
            }
        }
    )


@csrf_exempt
def logout_view(request):
    if request.method != "POST":
        return JsonResponse({"detail": "Method not allowed"}, status=405)

    logout(request)

    return JsonResponse({"detail": "Logged out successfully"})
