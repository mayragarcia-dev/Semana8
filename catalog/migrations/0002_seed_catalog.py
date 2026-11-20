from decimal import Decimal

from django.db import migrations


def seed_catalog(apps, schema_editor):
    Category = apps.get_model("catalog", "Category")
    Product = apps.get_model("catalog", "Product")

    category_data = [
        ("Computación", "Equipos y periféricos para trabajar y estudiar."),
        ("Audio", "Audífonos y equipos para disfrutar música y contenido."),
        ("Accesorios", "Complementos para llevar y cuidar tus dispositivos."),
    ]
    categories = {
        name: Category.objects.get_or_create(name=name, defaults={"description": description})[0]
        for name, description in category_data
    }

    products = [
        ("NovaBook Pro 14", "Laptop ligera para trabajo y estudio.", "3299.90", 12, "Computación", "novabook-pro.png"),
        ("Mouse inalámbrico M3", "Mouse ergonómico con conexión inalámbrica.", "89.90", 35, "Computación", "mouse.png"),
        ("Teclado mecánico K2", "Teclado compacto con retroiluminación.", "249.00", 18, "Computación", "keyboard.png"),
        ("Audífonos Pulse", "Audífonos acolchados con micrófono integrado.", "179.90", 24, "Audio", "headphones.png"),
        ("Parlante MiniSound", "Parlante portátil Bluetooth.", "139.00", 16, "Audio", "speaker.png"),
        ("Mochila urbana Tech", "Mochila con compartimento acolchado para laptop.", "159.90", 20, "Accesorios", "backpack.png"),
        ("Base ajustable", "Soporte plegable de aluminio para laptop.", "99.00", 28, "Accesorios", "laptop-stand.png"),
        ("Cable USB-C trenzado", "Cable de carga y datos de un metro.", "35.00", 50, "Accesorios", "usb-cable.png"),
    ]
    for name, description, price, stock, category, image in products:
        Product.objects.get_or_create(
            name=name,
            defaults={
                "description": description,
                "price": Decimal(price),
                "stock": stock,
                "category": categories[category],
                "image": f"products/{image}",
            },
        )


def unseed_catalog(apps, schema_editor):
    Category = apps.get_model("catalog", "Category")
    Product = apps.get_model("catalog", "Product")
    Product.objects.filter(name__in=[
        "NovaBook Pro 14", "Mouse inalámbrico M3", "Teclado mecánico K2",
        "Audífonos Pulse", "Parlante MiniSound", "Mochila urbana Tech",
        "Base ajustable", "Cable USB-C trenzado",
    ]).delete()
    Category.objects.filter(name__in=["Computación", "Audio", "Accesorios"]).delete()


class Migration(migrations.Migration):
    dependencies = [("catalog", "0001_initial")]

    operations = [migrations.RunPython(seed_catalog, unseed_catalog)]
