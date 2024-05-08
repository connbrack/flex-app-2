// From: https://github.com/AkileshRao/Service-worker-notification/blob/main/sw.js
const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

self.addEventListener("activate", async (e) => {
  const subscription = await self.registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(
      "BFKuvwD0KjlRgrryYFo58CqLJ-bg-z3qGNh3Qxw5T6A_4kSQsgCNoH7mH03V2dx4E8Hlrwe-ZsXlUpnoacakeuY"
    ),
  });
});

self.addEventListener("push", (e) => {
  self.registration.showNotification("Wohoo!!", { body: e.data.text() });
});
