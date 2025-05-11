"use client";

import { initializeApp, getApps } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_firebaseApiKey,
  authDomain: process.env.NEXT_PUBLIC_firebaseAuthDomain,
  projectId: process.env.NEXT_PUBLIC_firebaseProjectId,
  storageBucket: process.env.NEXT_PUBLIC_firebaseStorageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_firebaseMessagingSenderId,
  appId: process.env.NEXT_PUBLIC_firebaseAppId,
};

console.log("Firebase Config:", firebaseConfig);

// Initialize Firebase only if it hasn't been initialized yet
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

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

    if (permission === "granted") {
      // Register service worker first
      if ("serviceWorker" in navigator) {
        try {
          const registration = await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js"
          );
          console.log("Service Worker registered:", registration);

          const token = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY as string,
            serviceWorkerRegistration: registration,
          });

          console.log("FCM Token-----------------:", token);
          return token;
        } catch (err) {
          console.error("Service worker registration failed:", err);
          return null;
        }
      } else {
        console.error("Service workers are not supported");
        return null;
      }
    } else {
      console.log("Permission not granted:", permission);
      return null;
    }
  } catch (error) {
    console.error("Error generating token:", error);
    return null;
  }
};

export { messaging };
