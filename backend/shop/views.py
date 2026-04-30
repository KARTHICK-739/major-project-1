import json
from decimal import Decimal

from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .models import Order, OrderItem, Product
from .seed_data import PRODUCTS
from .serializers import order_to_dict, product_to_dict


def ensure_seed_products():
    if Product.objects.exists():
        return

    for data in PRODUCTS:
        Product.objects.create(**data)


def parse_body(request):
    try:
        return json.loads(request.body.decode("utf-8") or "{}")
    except json.JSONDecodeError:
        return {}


@require_http_methods(["GET", "OPTIONS"])
def products(request):
    ensure_seed_products()
    data = [product_to_dict(product) for product in Product.objects.all().order_by("id")]
    return JsonResponse(data, safe=False)


@require_http_methods(["GET", "OPTIONS"])
def product_detail(request, product_id):
    ensure_seed_products()
    try:
        product = Product.objects.get(pk=product_id)
    except Product.DoesNotExist:
        return JsonResponse({"detail": "Product not found"}, status=404)

    return JsonResponse(product_to_dict(product))


@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def register(request):
    if request.method == "OPTIONS":
        return JsonResponse({})

    data = parse_body(request)
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return JsonResponse({"detail": "Email and password are required."}, status=400)

    if User.objects.filter(username=email).exists():
        return JsonResponse({"detail": "User already exists."}, status=400)

    user = User.objects.create_user(
        username=email,
        email=email,
        password=password,
        first_name=data.get("firstName", "").strip(),
        last_name=data.get("lastName", "").strip(),
    )

    return JsonResponse(
        {
            "id": user.id,
            "email": user.email,
            "firstName": user.first_name,
            "lastName": user.last_name,
        },
        status=201,
    )


@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def login(request):
    if request.method == "OPTIONS":
        return JsonResponse({})

    data = parse_body(request)
    email = data.get("email", "").strip().lower()
    user = authenticate(username=email, password=data.get("password", ""))

    if user is None:
        return JsonResponse({"detail": "Invalid email or password."}, status=400)

    return JsonResponse(
        {
            "id": user.id,
            "email": user.email,
            "firstName": user.first_name,
            "lastName": user.last_name,
        }
    )


@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def create_order(request):
    if request.method == "OPTIONS":
        return JsonResponse({})

    ensure_seed_products()
    data = parse_body(request)
    items = data.get("items", [])
    shipping = data.get("shipping", {})

    if not items:
        return JsonResponse({"detail": "No order items."}, status=400)

    total = Decimal("0.00")
    clean_items = []
    for item in items:
        product = Product.objects.get(pk=item["id"])
        qty = max(1, int(item.get("qty", 1)))
        total += product.price * qty
        clean_items.append((product, qty))

    order = Order.objects.create(
        customer_name=data.get("customerName", ""),
        email=data.get("email", ""),
        address=shipping.get("address", ""),
        city=shipping.get("city", ""),
        pin_code=shipping.get("pinCode", ""),
        country=shipping.get("country", ""),
        payment_method=data.get("paymentMethod", "Cash on Delivery"),
        total_price=total,
    )

    for product, qty in clean_items:
        OrderItem.objects.create(
            order=order,
            product=product,
            name=product.name,
            qty=qty,
            price=product.price,
        )

    return JsonResponse(order_to_dict(order), status=201)
