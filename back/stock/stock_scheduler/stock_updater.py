from apscheduler.schedulers.background import BackgroundScheduler
from stock.views import save_stock_data


def start():
    scheduler = BackgroundScheduler()
    scheduler.add_job(save_stock_data, "interval", minutes=120, id="stock_001", replace_existing=True)
    scheduler.start()
