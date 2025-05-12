"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken, Messaging } from "firebase/messaging";
import { toast } from "sonner";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize messaging if window is available
let messagingInstance: Messaging | null = null;
if (typeof window !== "undefined") {
  try {
    messagingInstance = getMessaging(app);
  } catch (error) {
    console.error("Error initializing Firebase Messaging:", error);
  }
}

// Simplified token generation function
export const generateToken = async (): Promise<string | null> => {
  if (typeof window === "undefined" || !messagingInstance) {
    console.log("Window is undefined or messaging not initialized");
    return null;
  }

  try {
    // Check browser support for notifications
    if (!("Notification" in window)) {
      toast.error("This browser does not support notifications");
      return null;
    }

    // Request permission
    const permission = await Notification.requestPermission();
    console.log("Notification permission:", permission);

    if (permission !== "granted") {
      toast.error("Notification permission denied");
      return null;
    }

    // Check service worker support
    if (!("serviceWorker" in navigator)) {
      toast.error("Service workers are not supported in this browser");
      return null;
    }

    // First, check if the service worker is already registered
    const existingRegistrations =
      await navigator.serviceWorker.getRegistrations();

    // Unregister any existing service workers to avoid conflicts
    for (const reg of existingRegistrations) {
      if (reg.scope.includes(window.location.origin)) {
        await reg.unregister();
        console.log("Unregistered existing service worker");
      }
    }

    // Directly fetch the service worker file first to ensure it exists
    // This can help diagnose if the file is accessible
    try {
      const response = await fetch("/firebase-messaging-sw.js");
      if (!response.ok) {
        console.error(
          `Service worker file fetch failed: ${response.status} ${response.statusText}`
        );
        toast.error("Failed to load service worker file");
        return null;
      }
      console.log("Service worker file is accessible");
    } catch (fetchError) {
      console.error("Failed to fetch service worker file:", fetchError);
      toast.error("Unable to access service worker file");
      return null;
    }

    // Now register the service worker
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
      {
        scope: "/",
      }
    );

    console.log(
      "Service Worker registered successfully with scope:",
      registration.scope
    );

    // Ensure service worker is active before proceeding
    if (registration.installing) {
      console.log("Service worker installing...");

      // Wait for the service worker to be ready
      await new Promise<void>((resolve) => {
        registration.installing?.addEventListener("statechange", (event) => {
          if ((event.target as ServiceWorker).state === "activated") {
            console.log("Service worker activated");
            resolve();
          }
        });
      });
    } else if (registration.waiting) {
      console.log("Service worker waiting");
    } else if (registration.active) {
      console.log("Service worker already active");
    }

    // Get the VAPID key
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_KEY;
    if (!vapidKey) {
      toast.error("VAPID key is missing");
      return null;
    }

    // Get FCM token
    console.log("Requesting FCM token with service worker registration");
    const token = await getToken(messagingInstance, {
      vapidKey,
      serviceWorkerRegistration: registration,
    });

    if (!token) {
      toast.error("Failed to get FCM token");
      return null;
    }

    console.log("FCM Token:", token);
    return token;
  } catch (error) {
    console.error("Error generating FCM token:", error);

    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      toast.error(`FCM setup failed: ${error.message}`);
    } else {
      toast.error("Unknown error during FCM setup");
    }

    return null;
  }
};

export { messagingInstance as messaging };
