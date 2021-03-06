# Generated by Django 4.0.4 on 2022-05-18 15:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0013_alter_account_creation_time_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='card_expiration_date',
            field=models.DateTimeField(null=True),
        ),
        migrations.AddField(
            model_name='account',
            name='card_number',
            field=models.CharField(max_length=16, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name='account',
            name='acc_type',
            field=models.CharField(choices=[('CUR', 'Current'), ('SVG', 'Savings'), ('CARD', 'CARD')], default='CUR', max_length=8),
        ),
        migrations.AlterField(
            model_name='account',
            name='creation_time',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
