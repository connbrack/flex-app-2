
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from dotenv import load_dotenv
import json
import os

def send_notification(title, message, api_key):

    url = 'https://www.pushsafer.com/api'
    post_fields = {
        "t" : '[Flex-app] ' + title,
        "m" : message,
        "k" : api_key,
        "u" : 'https://www.pushsafer.com',
        "c" : '#84BD00'
        }

    request = Request(url, urlencode(post_fields).encode())
    response = json.loads(urlopen(request).read().decode())
    if response['status'] == 0:
        raise Exception(f'Notification failed to send ({response["error"]})')

if __name__ == '__main__':
    load_dotenv()
    send_notification('Test', 'This is a test message', os.getenv('PUSH_KEY'))
