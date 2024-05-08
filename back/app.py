import os
import random
from flask import Flask, request
from multiprocessing import Process
from notifications import send_notification

from booking_funcs import notify_close_cars

# For local testing Only:
from dotenv import load_dotenv
load_dotenv()

# Check keys when program start
KEYS = os.getenv('KEYS')
if not KEYS:
    print('Missing KEYS environment variable.')
    os._exit(1)

app = Flask(__name__, static_folder='../front/build', static_url_path='/')

@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')

@app.route('/api/request_booking', methods=['POST'])
def main_function():
    # import keys from environment variables

    data = request.get_json()


    keys = dict(item.split(':') for item in KEYS.split(','))
    if data['FlexKey'] not in keys.values():
        raise ValueError("Invalid key")

    loc = data['latLong']
    login_cred = [data['CommunautoEmail'], data['CommunautoPassword']]
    max_dis = data['radius']
    push_key = data['PushKey']
    ethical = data['ethicalMode']

    autobook = True

    p = Process(target=notify_close_cars, args=(loc, max_dis, push_key,autobook,login_cred, ethical,), name=f'{push_key}{random.randint(10000, 99999)}')
    p.start()

    send_notification(temp_database[0], 'we started looking :)')

    return {'status': 'success'}

@app.route('/api/send-test-message', methods=['POST'])
def save_subscription():
    data = request.get_json()
    return send_notification('Hello World', data)

if __name__ == '__main__':
    app.run(debug=True)
