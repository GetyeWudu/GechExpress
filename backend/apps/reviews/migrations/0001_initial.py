# Generated migration for Review models

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.core.validators


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('orders', '0001_initial'),
        ('products', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Review',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rating', models.PositiveIntegerField(validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(5)])),
                ('title', models.CharField(blank=True, max_length=255)),
                ('comment', models.TextField(blank=True)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')], default='pending', max_length=20)),
                ('helpful_count', models.PositiveIntegerField(default=0)),
                ('unhelpful_count', models.PositiveIntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('order_item', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='review', to='orders.orderitem')),
                ('product_variant', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='reviews', to='products.productvariant')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reviews', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='ReviewVote',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('vote_type', models.CharField(choices=[('helpful', 'Helpful'), ('unhelpful', 'Unhelpful')], max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('review', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='votes', to='reviews.review')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='review_votes', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddConstraint(
            model_name='review',
            constraint=models.UniqueConstraint(condition=models.Q(('status__in', ['approved', 'pending'])), fields=['user', 'product_variant'], name='unique_active_review_per_user_variant'),
        ),
        migrations.AddIndex(
            model_name='reviewvote',
            index=models.Index(fields=['review', '-created_at'], name='reviews_re_review_i_idx'),
        ),
        migrations.AddIndex(
            model_name='review',
            index=models.Index(fields=['product_variant', '-rating'], name='reviews_re_product__idx'),
        ),
        migrations.AddIndex(
            model_name='review',
            index=models.Index(fields=['user', '-created_at'], name='reviews_re_user_id_idx'),
        ),
        migrations.AddIndex(
            model_name='review',
            index=models.Index(fields=['status', '-created_at'], name='reviews_re_status_idx'),
        ),
        migrations.AddConstraint(
            model_name='reviewvote',
            constraint=models.UniqueConstraint(fields=['review', 'user'], name='unique_review_vote_per_user'),
        ),
    ]
