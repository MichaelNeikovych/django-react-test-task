import json
from datetime import date, datetime

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from users.models import UserProfile

from requests.models import Request


def serialize_request(request):
    return {
        "id": request.id,
        "title": request.title,
        "description": request.description,
        "execution_date": request.execution_date.isoformat(),
        "created_by": request.created_by.username,
        "created_at": request.created_at.isoformat(),
    }


@csrf_exempt
def user_requests_view(request):
    if not request.user.is_authenticated():
        return JsonResponse({"detail": "Authentication required"}, status=401)

    if request.method == "GET":
        user_requests = Request.objects.all().order_by("-created_at")

        return JsonResponse(
            {"requests": [serialize_request(item) for item in user_requests]}
        )

    if request.method == "POST":
        if request.user.profile.role != UserProfile.ROLE_ADMIN:
            return JsonResponse({"detail": "Permission denied"}, status=403)

        try:
            data = json.loads(request.body)
        except (TypeError, ValueError):
            return JsonResponse({"detail": "Invalid JSON"}, status=400)

        title = data.get("title")
        description = data.get("description")
        execution_date = data.get("execution_date")

        if not title or not description or not execution_date:
            return JsonResponse({"detail": "All fields are required"}, status=400)

        try:
            execution_date = datetime.strptime(execution_date, "%Y-%m-%d").date()
        except ValueError:
            return JsonResponse({"detail": "Invalid date"}, status=400)

        if execution_date < date.today():
            return JsonResponse(
                {"detail": "Execution date cannot be in the past"}, status=400
            )

        if len(title) < 3 or len(title) > 100:
            return JsonResponse(
                {"detail": "Title must be between 3 and 100 characters"}, status=400
            )

        if len(description) < 10:
            return JsonResponse(
                {"detail": "Description must contain at least 10 characters"},
                status=400,
            )

        request_obj = Request.objects.create(
            title=title,
            description=description,
            execution_date=execution_date,
            created_by=request.user,
        )

        return JsonResponse({"request": serialize_request(request_obj)}, status=201)

    return JsonResponse({"detail": "Method not allowed"}, status=405)
