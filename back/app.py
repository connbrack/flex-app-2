import os
import random
from flask import Flask, request
from multiprocessing import Process
from notifications import send_notification

from booking_funcs import notify_close_cars

# For local testing Only:
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__, static_folder='../front/build', static_url_path='/')

@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')

@app.route('/api/request_booking', methods=['POST'])
def main_function():
    data = request.get_json()

    loc = data['latLong']
    login_cred = [data['CommunautoEmail'], data['CommunautoPassword']]
    max_dis = data['radius']
    ethical = data['ethicalMode']
    push_key = data['pushSubscription']

    autobook = True

    p = Process(target=notify_close_cars, args=(loc, max_dis, push_key,autobook,login_cred, ethical,), name=f'{push_key}{random.randint(10000, 99999)}')
    p.start()

    return {'status': 'success'}

@app.route('/api/notification-confirmation', methods=['POST'])
def save_subscription():
    data = request.get_json()
    return send_notification('Success! You can now receive notifications', data)

if __name__ == '__main__':
    app.run(debug=True)
