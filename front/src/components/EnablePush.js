import { useToast } from "@chakra-ui/react";

function EnablePush() {
  const toast = useToast();
  function showToast(title, description, status) {
    toast({
      title: title,
      description: description,
      status: status,
      duration: 2000,
      isClosable: true,
    });
  }

  function enablePush() {
    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Permission granted");
          checkAndResubscribe();
        } else {
          alert(
            "Push notification are required to use this app. Please enable them. After enabling, use this button again to subscribe. \n\nIf you are on mobile, install the progressive web app and try again."
          );
        }
      });
    } else {
      checkAndResubscribe();
    }
  }

  const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  };

  function checkAndResubscribe() {
    navigator.serviceWorker.ready.then((registration) => {
      registration.pushManager.getSubscription().then((subscription) => {
        if (subscription) {
          console.log("User is already subscribed.");
          sendSubscriptionToServer(subscription);
        } else {
          console.log("User is not subscribed.");
          subscribeUser(registration);
        }
      });
    });
  }

  function subscribeUser(registration) {
    const applicationServerKey = urlBase64ToUint8Array(
      "BFKuvwD0KjlRgrryYFo58CqLJ-bg-z3qGNh3Qxw5T6A_4kSQsgCNoH7mH03V2dx4E8Hlrwe-ZsXlUpnoacakeuY"
    );
    registration.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey,
      })
      .then((subscription) => {
        console.log("User is subscribed.");
        sendSubscriptionToServer(subscription);
      })
      .catch((err) => {
        console.error("Failed to subscribe the user: ", err);
      });
  }

  function sendSubscriptionToServer(subscription) {
    fetch("/api/notification-confirmation", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscription),
    })
      .then((response) => {
        response.json();
        showToast(
          "Subscribed",
          "You should receive a test notification shortly.",
          "success"
        );
      })
      .catch((error) => {
        console.error("Error sending subscription:", error);
        showToast(
          "Dammit !!",
          "Something seems to have gone wrong in the back end",
          "error"
        );
      });
  }

  return (
    <div>
      <div>
        <button
          className="button-alt"
          onClick={(e) => {
            e.preventDefault();
            enablePush();
          }}
        >
          <div>Click here to</div>
          Enable Push Notifications
        </button>
      </div>
    </div>
  );
}

export default EnablePush;
