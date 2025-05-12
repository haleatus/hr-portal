// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js" // Consider using latest or matching your app's SDK
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js" // Consider using latest or matching your app's SDK
);

// IMPORTANT: Make sure this config matches EXACTLY what's in src/notification/firebase.ts
const firebaseConfig = {
  apiKey: "AIzaSyAenenFbxDWVskMcggeeW5OovTuBEgudXw",
  authDomain: "hr-portal-notifications.firebaseapp.com",
  projectId: "hr-portal-notifications",
  storageBucket: "hr-portal-notifications.firebasestorage.app",
  messagingSenderId: "814851903871",
  appId: "1:814851903871:web:74ebe3d18e8ed1d1d0ca4a",
  measurementId: "G-YTEB1PBL3J"
};

// Initialize the Firebase app in the service worker
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  // The app is ALREADY in the background or closed if this callback is triggered.
  // So, directly show the notification.
  const notificationTitle = payload.notification?.title || "New Notification"; // Add fallbacks
  const notificationOptions = {
    body: payload.notification?.body || "You have a new message.",
    icon: payload.notification?.image, // Ensure this image URL is publicly accessible
    // data: payload.data // You might want to pass data to handle clicks
  };

  // `self` is the ServiceWorkerGlobalScope
  self.registration.showNotification(notificationTitle, notificationOptions);
});