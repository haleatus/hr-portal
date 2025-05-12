"use client";

import { initializeApp, getApps } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAJrRJUEek-Qxl9V4zIq-8UaCWjrZQp7cg",
  authDomain: "hr-hub-a7803.firebaseapp.com",
  projectId: "hr-hub-a7803",
  storageBucket: "hr-hub-a7803.firebasestorage.app",
  messagingSenderId: "355311572334",
  appId: "1:355311572334:web:b95096bd8910e5b2d71d7f",
};

// Initialize Firebase only if it hasn't been initialized yet
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
// const analytics = getAnalytics(app);

// Initialize messaging only on the client side
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let messaging: any;

if (typeof window !== "undefined") {
  try {
    messaging = getMessaging(app);
  } catch (error) {
    console.error("Error initializing messaging:", error);
  }
}

export const generateToken = async () => {
  if (typeof window === "undefined") {
    console.log("Window is undefined - running on server side");
    return null;
  }

  try {
    // Check if browser supports notifications
    if (!("Notification" in window)) {
      console.error("This browser does not support desktop notification");
      return null;
    }

    const permission = await Notification.requestPermission();
    console.log("Notification permission:", permission);

    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }

    // Make sure messaging is initialized
    if (!messaging) {
      console.error("Firebase messaging not initialized");
      return null;
    }

    // Register service worker
    if ("serviceWorker" in navigator) {
      try {
        // First check if service worker is already registered
        let registration = await navigator.serviceWorker.getRegistration(
          "/firebase-messaging-sw.js"
        );

        if (!registration) {
          console.log("Registering service worker...");
          registration = await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js",
            {
              scope: "/",
            }
          );
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        } else {
          console.log(
            "Service Worker already registered with scope:",
            registration.scope
          );
        }

        // Wait for the service worker to be ready
        await navigator.serviceWorker.ready;

        // Get FCM token
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
          serviceWorkerRegistration: registration,
        });

        if (token) {
          console.log("FCM Token generated:", token);
          return token;
        } else {
          console.error("No FCM token generated");
          return null;
        }
      } catch (err) {
        console.error("Service worker registration failed:", err);
        return null;
      }
    } else {
      console.error("Service workers are not supported in this browser");
      return null;
    }
  } catch (error) {
    console.error("Error generating token:", error);
    return null;
  }
};

export { messaging };
