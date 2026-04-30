from django.urls import path

from . import views


urlpatterns = [
    path("products/", views.products, name="products"),
    path("products/<int:product_id>/", views.product_detail, name="product-detail"),
    path("auth/register/", views.register, name="register"),
    path("auth/login/", views.login, name="login"),
    path("orders/", views.create_order, name="create-order"),
]
