# Generated migration for Shipping models

from django.db import migrations, models
import django.db.models.deletion
import django.core.validators


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('orders', '0001_initial'),
        ('products', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ShippingMethod',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('code', models.CharField(max_length=50, unique=True)),
                ('description', models.TextField(blank=True)),
                ('base_cost', models.DecimalField(decimal_places=2, max_digits=12, validators=[django.core.validators.MinValueValidator('0.00')])),
                ('estimated_days_min', models.PositiveIntegerField(default=1)),
                ('estimated_days_max', models.PositiveIntegerField(default=5)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='Shipment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('preparing', 'Preparing'), ('shipped', 'Shipped'), ('in_transit', 'In Transit'), ('delivered', 'Delivered'), ('failed', 'Failed'), ('returned', 'Returned')], default='pending', max_length=20)),
                ('recipient_full_name', models.CharField(max_length=255)),
                ('recipient_phone', models.CharField(max_length=30)),
                ('recipient_address', models.TextField()),
                ('recipient_city', models.CharField(max_length=100)),
                ('recipient_country', models.CharField(max_length=100)),
                ('tracking_number', models.CharField(blank=True, db_index=True, max_length=100)),
                ('carrier_url', models.URLField(blank=True)),
                ('shipped_at', models.DateTimeField(blank=True, null=True)),
                ('delivered_at', models.DateTimeField(blank=True, null=True)),
                ('carrier_reference', models.CharField(blank=True, max_length=255)),
                ('notes', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('order', models.OneToOneField(on_delete=django.db.models.deletion.PROTECT, related_name='shipment', to='orders.order')),
                ('shipping_method', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='shipments', to='shipping.shippingmethod')),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='ShipmentItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.PositiveIntegerField(validators=[django.core.validators.MinValueValidator(1)])),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('product_variant', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='shipment_items', to='products.productvariant')),
                ('shipment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='shipping.shipment')),
            ],
            options={
                'ordering': ['id'],
            },
        ),
        migrations.AddIndex(
            model_name='shipment',
            index=models.Index(fields=['order', '-created_at'], name='shipping_sh_order_i_idx'),
        ),
        migrations.AddIndex(
            model_name='shipment',
            index=models.Index(fields=['status', '-created_at'], name='shipping_sh_status_idx'),
        ),
        migrations.AddIndex(
            model_name='shipment',
            index=models.Index(fields=['tracking_number'], name='shipping_sh_trackin_idx'),
        ),
    ]
