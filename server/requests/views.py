import json
from datetime import date, datetime

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from users.models import UserProfile

from requests.models import Request


class Validation:
    MIN_DESCRIPTION_LENGTH = 10
    MIN_TITLE_LENGTH = 3
    MAX_TITLE_LENGTH = 100


def serialize_request(request):
    return {
        "id": request.id,
        "title": request.title,
        "description": request.description,
        "execution_date": request.execution_date.isoformat(),
        "created_by": request.created_by.username,
        "created_at": request.created_at.isoformat(),
    }


def get_json_response(message, status_code):
    return JsonResponse({"detail": message}, status=status_code)


@csrf_exempt
def user_requests_view(request):
    if not request.user.is_authenticated():
        return get_json_response(message="Authentication required", status_code=401)

    if request.method == "GET":
        user_requests = Request.objects.all().order_by("-created_at")

        return JsonResponse(
            {"requests": [serialize_request(item) for item in user_requests]}
        )

    if request.method != "POST":
        return get_json_response(message="Method not allowed", status_code=405)

    if request.user.profile.role != UserProfile.ROLE_ADMIN:
        return get_json_response(message="Permission denied", status_code=403)

    try:
        data = json.loads(request.body)
    except (TypeError, ValueError):
        return get_json_response(message="Invalid JSON", status_code=400)

    title = data.get("title")
    description = data.get("description")
    execution_date = data.get("execution_date")

    if not title or not description or not execution_date:
        return JsonResponse({"detail": "All fields are required"}, status=422)

    try:
        execution_date = datetime.strptime(execution_date, "%Y-%m-%d").date()
    except ValueError:
        return get_json_response(message="Invalid date", status_code=422)

    if execution_date < date.today():
        return get_json_response(
            message="Execution date cannot be in the past", status_code=422
        )

    if (
        len(title) < Validation.MIN_TITLE_LENGTH
        or len(title) > Validation.MAX_TITLE_LENGTH
    ):
        return get_json_response(
            message="Title must be between 3 and 100 characters",
            status_code=422,
        )

    if len(description) < Validation.MIN_DESCRIPTION_LENGTH:
        return get_json_response(
            message="Description must contain at least 10 characters",
            status_code=422,
        )

    request_obj = Request.objects.create(
        title=title,
        description=description,
        execution_date=execution_date,
        created_by=request.user,
    )

    return JsonResponse({"request": serialize_request(request_obj)}, status=201)
