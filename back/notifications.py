from flask import Flask, jsonify
from pywebpush import webpush, WebPushException
import os

from dotenv import load_dotenv
load_dotenv()

VAPID_PRIVATE_KEY = os.getenv('VAPID_PRIVATE_KEY')
VAPID_CLAIMS = { "sub": "mailto:your-email@example.com" }


def send_notification(message, subscription_info):
    try:
        webpush(
            subscription_info=subscription_info,
            data=message,
            vapid_private_key=VAPID_PRIVATE_KEY,
            vapid_claims=VAPID_CLAIMS
        )
        return jsonify({"status": "Success", "message": "Message sent to push service"})
    except WebPushException as ex:
        return jsonify({"status": "Failed", "message": "Failed to send notification", "details": str(ex)}), 500
