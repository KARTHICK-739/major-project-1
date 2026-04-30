from django.core.management.base import BaseCommand

from shop.models import Product
from shop.seed_data import PRODUCTS


class Command(BaseCommand):
    help = "Seed dummy ecommerce products."

    def handle(self, *args, **options):
        for data in PRODUCTS:
            Product.objects.update_or_create(name=data["name"], defaults=data)

        self.stdout.write(self.style.SUCCESS(f"Seeded {len(PRODUCTS)} products."))
