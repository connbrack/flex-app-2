const EnablePush = () => {
  function enablePush() {
    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Permission granted");
        } else {
          console.log("Permission denied");
        }
      });
    }
  }

  function checkAndResubscribe() {
    navigator.serviceWorker.ready.then((registration) => {
      registration.pushManager.getSubscription().then((subscription) => {
        if (subscription) {
          console.log("Subscription found");
          console.log(subscription);
          sendSubscriptionToServer(subscription);

        } else {
          console.log("No subscription");
        }
      });
    });
  }

  function sendSubscriptionToServer(subscription) {
      fetch('/api/send-test-message', {
          method: 'post',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(subscription)
      }).then(response => response.json())
      .catch(error => console.error('Error sending subscription:', error));
  }

  function testPush() {
    checkAndResubscribe()
  }

  return (
    <div>
      <div>
        <button className="button" onClick={enablePush}>
          Enable Push Notifications
        </button>

        <button className="button" onClick={testPush}>
          test push
        </button>
      </div>
    </div>
  );
};

export default EnablePush;
