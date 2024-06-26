import requests
import numpy as np
import geopy.distance
import time
import subprocess

from notifications import send_notification
from playwright.sync_api import sync_playwright
import json

def notify_close_cars(loc, max_dis, push_subscription, book_car_enable, communauto_cred, ethical_mode, sleep_time=5, max_time=1800):
    try:

        max_dis = float(max_dis)

        if book_car_enable:
            send_notification('Car search has started !! You will be notified when a car is booked', push_subscription)
        else:
            send_notification('Car search has started - The flex-app has begun searching for your car, you will be notified when a car is close', push_subscription)

        # Log in
        if book_car_enable:
            customer_ID, session_ID = get_valid_session(communauto_cred)

        # Begin search
        num_loops = round(max_time / sleep_time)

        for i in range(num_loops):
            if i != 0:
                time.sleep(sleep_time)

            r = requests.get('https://www.reservauto.net/WCF/LSI/LSIBookingServiceV3.svc/GetAvailableVehicles?BranchID=1&LanguageID=2')
            cars = r.json()

            n = len(cars['d']['Vehicles'])
            car_list = np.empty((n,2))
            for i, car in enumerate(cars['d']['Vehicles']):
                lat_long = [car['Latitude'], car['Longitude']]
                carNo = car['CarId']
                distance = geopy.distance.geodesic(loc, lat_long).km
                car_list[i,:] = np.array([distance, carNo])

            car_list_filtered = car_list[car_list[:,0] < max_dis]
            car_list_filtered = car_list_filtered[car_list_filtered[:,0].argsort()] 
            num_cars = car_list_filtered.shape[0]

            ignore_list = []
            if (num_cars > 0):
                if book_car_enable == False:
                    if num_cars > 0:
                        if num_cars==1:
                            message = f'There is 1 car that is {max_dis} km away'
                            send_notification(f'Car found  - {message}', push_subscription)
                        elif num_cars>1:
                            message = f'There are {num_cars} cars that are {max_dis} km away'
                            send_notification(f'Car found  - {message}', push_subscription)
                        return
                else:
                    if ethical_mode:
                        time.sleep(5)
                    for car in car_list_filtered[:,1]:
                        if car not in ignore_list:
                            booking_result, booking_message = book_car(int(car), customer_ID, session_ID)
                            if booking_result:
                                message = f'''A car was booked sucessfully !!'''
                                send_notification(f'{message}', push_subscription)
                                return
                            elif booking_message == 'The booking limit on this vehicle has been reached.':
                                message = f'A booking was attempted but the booking limit on that vehicle had been reached !! The search is continuing.'
                                send_notification(f'Unsuccessful booking - {message}', push_subscription) 
                                ignore_list.append(car)
                                time.sleep(.25)
                            elif booking_message == 'The vehicle is unavailable.':
                                message = f'A booking was attempted but be were not fast enough so the car was not successfully booked!! The search is continuing.'
                                send_notification(f'Unsuccessful booking - {message}', push_subscription) 
                            else:
                                message = f'A booking was attempted but failed for the reason below.\n\n{booking_message}'
                                send_notification(f'Search stopped - {message}', push_subscription) 
                                return

        send_notification('Car not found - Max time has been reached and no car was found', push_subscription)

    except Exception as e:
        message = f'The search has stopped. Please try again.\n\nThe script crashed for reason:\n\t{e}'
        send_notification(f'Script crashed - {message}', push_subscription)


def get_valid_session(communauto_cred):
    USER, PASS = communauto_cred

    LOGIN_URL = 'https://securityservice.reservauto.net/Account/Login?returnUrl=%2Fconnect%2Fauthorize%2Fcallback%3Fclient_id%3DCustomerSpaceV2Client%26redirect_uri%3Dhttps%253A%252F%252Fquebec.client.reservauto.net%252Fsignin-callback%26response_type%3Dcode%26scope%3Dopenid%2520profile%2520reservautofrontofficerestapi%2520communautorestapi%2520offline_access%26state%3D822a20f902424990988f76aea1218724%26code_challenge%3DGn39oR_skXJHjIL5um3Zv1iTt8ErcK5iid9EsIJgUo8%26code_challenge_method%3DS256%26ui_locales%3Den-ca%26acr_values%3Dtenant%253A1%26response_mode%3Dquery%26branch_id%3D1&ui_locales=en-ca&BranchId=1'

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        page.goto(LOGIN_URL)
        page.locator('input[name="Username"]').fill(USER)
        page.locator('input[name="Password"]').fill(PASS)
        page.click('button.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary')
        page.wait_for_load_state('networkidle')
        page.goto('https://quebec.client.reservauto.net/bookCar')
        page.wait_for_load_state('networkidle')
        page.goto('https://www.reservauto.net/Scripts/Client/ReservationAdd.asp?ReactIframe=true&CurrentLanguageID=2')
        page.wait_for_load_state('domcontentloaded')

        session_ID = [f"{c['name']}={c['value']}" for c in context.cookies() if c['name'] in 'mySession'][0]
        customer_ID = [f"{c['value']}" for c in context.cookies() if c['name'] in 'uid'][0]

        browser.close()
    
    return customer_ID, session_ID

def book_car(car_ID, customer_ID, session_ID):
    url = f'https://www.reservauto.net/WCF/LSI/LSIBookingServiceV3.svc/CreateBooking?CustomerID={customer_ID}&CarID={car_ID}'

    header = {'Cookie': session_ID}
    r = requests.get(url, headers=header)

    if r.status_code == 200:
        if json.loads(r.content)['d']['Success']:
            return True, ''
        else:
            return False, json.loads(r.content)['d']['ErrorMessage']
    else:
        return False, f'Received response [{r.status_code}] expected [200]' 
