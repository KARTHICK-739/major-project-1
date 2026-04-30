def product_to_dict(product):
    return {
        "id": product.id,
        "name": product.name,
        "brand": product.brand,
        "category": product.category,
        "description": product.description,
        "price": float(product.price),
        "rating": float(product.rating),
        "reviewCount": product.review_count,
        "countInStock": product.count_in_stock,
        "image": product.image,
    }


def order_to_dict(order):
    return {
        "id": order.id,
        "customerName": order.customer_name,
        "email": order.email,
        "address": order.address,
        "city": order.city,
        "pinCode": order.pin_code,
        "country": order.country,
        "paymentMethod": order.payment_method,
        "totalPrice": float(order.total_price),
        "items": [
            {
                "name": item.name,
                "qty": item.qty,
                "price": float(item.price),
                "product": item.product_id,
            }
            for item in order.items.all()
        ],
    }
