// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
firebase.initializeApp({
  apiKey: "AIzaSyAJrRJUEek-Qxl9V4zIq-8UaCWjrZQp7cg",
  authDomain: "hr-hub-a7803.firebaseapp.com",
  projectId: "hr-hub-a7803",
  storageBucket: "hr-hub-a7803.firebasestorage.app",
  messagingSenderId: "355311572334",
  appId: "1:355311572334:web:b95096bd8910e5b2d71d7f",
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image || '/logo192.png', // Make sure this image exists in public folder
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

