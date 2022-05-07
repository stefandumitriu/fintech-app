from django.apps import AppConfig


class StockConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'stock'

    def ready(self):
        print("Starting stock daemon")
        from .stock_scheduler import stock_updater
        stock_updater.start()
