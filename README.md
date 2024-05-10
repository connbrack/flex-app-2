# Flex2

This app allows for easy booking of flex cars in Montreal. Flex2 is the second generation of the flex app. Featuring an improved UI, thats easier to setup and use!

** Still in development **

Beta available: 
[flex2.connbrack.com](https://flex2.connbrack.com/)

## How it works

Once you kick off the search, the Flex app will start searching for a car within your chosen area and keep at it for thirty minutes. If it spots a car and nabs a booking for you, you'll get a ping to let you know you're all set. If it finds one but can’t book it quick enough, you'll get a heads-up, and the hunt continues. If the search script fails for any reason, the app will ping you again and put the search on pause. If after half an hour the Flex app hasn’t found wheels, you'll get a friendly note saying no car was found. Hang tight and try again!

### Ethical mode

When you choose ethical mode, if the Flex app finds a car, it will pause and wait for 5 seconds before pouncing on a car. This lets the humans compete but means you might miss out if someone else is quicker on the draw!

### Data storage

All data is saved to your browser, and is not logged anywhere else. Do not use if you do not trust the device your are using. Your information is accessed by the flex2 api only when car booking attempts are requested.

## Setup

1. Navigate to settings, and enter your Communauto login and password. Press the save button to save your credentials.
1. Tap the enable notifications button, and enable notifications. If you are on a mobile device, you will need to install this as a progressive web app to receive notifications.
1. Your all set! Navigate back to the home page and start searching for cars!

#### Self-host

If you want to host you're own instance of the flex app, clone the project and deploy it on your favorite cloud application hosting service. Currently, this instance is hosted on [render](https://render.com/).

When self-hosting, you'll need to set up a a private and public key pair for notifications. You can do this using web-push. Example: 

```
yarn global add web-push
web-push generate-vapid-keys
```

The public key should be added to the `src/service-worker.js` and `src/components/EnablePush.js` files. The private key as an environment variable in your hosting service under the name `VAPID_PRIVATE_KEY`. 

```
VAPID_PRIVATE_KEY="<Vapid Private key>"
```
