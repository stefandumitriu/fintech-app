# Generated by Django 4.0.4 on 2022-05-07 11:06

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Stock',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('symbol', models.CharField(max_length=10, unique=True)),
                ('currency', models.CharField(max_length=3)),
                ('exchange_name', models.CharField(max_length=100)),
                ('tradeable', models.BooleanField(default=False)),
                ('ask_price', models.IntegerField()),
                ('bid_price', models.IntegerField()),
                ('market_price', models.IntegerField()),
                ('market_change', models.IntegerField()),
                ('market_change_percent', models.IntegerField()),
                ('market_cap', models.BigIntegerField()),
            ],
        ),
    ]
