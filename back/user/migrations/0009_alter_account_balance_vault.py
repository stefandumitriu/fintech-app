# Generated by Django 4.0.4 on 2022-05-10 15:40

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0008_alter_account_balance'),
    ]

    operations = [
        migrations.AlterField(
            model_name='account',
            name='balance',
            field=models.DecimalField(decimal_places=2, max_digits=20),
        ),
        migrations.CreateModel(
            name='Vault',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=30)),
                ('goal', models.DecimalField(decimal_places=2, max_digits=20)),
                ('deadline_date', models.DateTimeField()),
                ('balance', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
