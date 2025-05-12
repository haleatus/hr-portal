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
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
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