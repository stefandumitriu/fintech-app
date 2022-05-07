from apscheduler.schedulers.background import BackgroundScheduler
from ..views import StockViewSet


def start():
    scheduler = BackgroundScheduler()
    stock = StockViewSet()
    scheduler.add_job(stock.save_stock_data, "interval" ,minutes=60, id="stock_001", replace_existing=True)
    scheduler.start()
