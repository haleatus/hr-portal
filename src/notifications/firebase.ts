"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken, Messaging } from "firebase/messaging";
import { toast } from "sonner";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let messagingInstance: Messaging | null = null;
if (typeof window !== "undefined") {
  try {
    messagingInstance = getMessaging(app);
  } catch (error) {
    console.error("Error initializing Firebase Messaging:", error);
  }
}

// Helper function to wait for service worker to be active
async function waitForServiceWorkerActivation(
  registration: ServiceWorkerRegistration
): Promise<ServiceWorker> {
  if (registration.active) {
    return registration.active;
  }
  // If there's an installing worker, wait for it to activate
  if (registration.installing) {
    return new Promise((resolve) => {
      registration.installing!.addEventListener(
        "statechange",
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        function (this: ServiceWorker, e: Event) {
          if (this.state === "activated") {
            resolve(this);
          }
        }
      );
    });
  }
  // If there's a waiting worker (e.g., after an update), it might need a page reload or skipWaiting()
  // For initial registration, installing -> activated is the main path.
  // This case might require more advanced handling if you frequently update SWs without page reloads.
  if (registration.waiting) {
    console.warn(
      "Service worker is waiting. This might require a page reload or skipWaiting() to activate."
    );
    // For simplicity here, we'll just return it, but getToken might still fail if it's not active.
    // A more robust solution might involve messaging the SW to call self.skipWaiting().
    return registration.waiting;
  }
  // Should not happen if registration was successful
  throw new Error(
    "Service worker registration has no active, installing, or waiting worker."
  );
}

export const generateToken = async (): Promise<string | null> => {
  if (typeof window === "undefined" || !messagingInstance) {
    console.log(
      "Window is undefined or messaging not initialized - cannot generate token."
    );
    return null;
  }

  try {
    if (!("Notification" in window)) {
      console.error("This browser does not support desktop notification");
      return null;
    }

    const permission = await Notification.requestPermission();
    console.log("Notification permission:", permission); // Should be "granted" now

    if (permission === "granted") {
      if ("serviceWorker" in navigator) {
        try {
          const registration = await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js"
          );
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );

          // --- IMPORTANT CHANGE: Wait for activation ---
          console.log("Waiting for Service Worker to activate...");
          await waitForServiceWorkerActivation(registration);
          console.log("Service Worker is active.");
          // At this point, registration.active should be the active service worker.

          const vapidKey = process.env.NEXT_PUBLIC_VAPID_KEY;
          if (!vapidKey) {
            console.error(
              "VAPID key is not defined. Check .env and next.config.js"
            );
            toast.error("VAPID key missing. Cannot get notification token."); // Added toast
            return null;
          }

          // Now get the token
          const token = await getToken(messagingInstance, {
            vapidKey: vapidKey,
            serviceWorkerRegistration: registration, // Pass the original registration object
          });

          console.log("FCM Token:", token);
          return token;
        } catch (err) {
          console.error(
            "Service worker registration or token retrieval failed:",
            err
          );
          if (err instanceof Error) {
            console.error("Error name:", err.name); // Will show "AbortError"
            console.error("Error message:", err.message); // Will show the detailed message
            toast.error(`Token retrieval failed: ${err.message}`); // Added toast
          } else {
            toast.error("An unknown error occurred during token retrieval.");
          }
          return null;
        }
      } else {
        console.error("Service workers are not supported in this browser.");
        toast.error(
          "Service workers not supported. Notifications unavailable."
        );
        return null;
      }
    } else {
      console.log("Notification permission not granted:", permission);
      toast.error("Notification permission denied. Cannot get token.");
      return null;
    }
  } catch (error) {
    console.error("Error generating FCM token (outer catch):", error);
    toast.error(
      "An unexpected error occurred while generating the notification token."
    );
    return null;
  }
};

export { messagingInstance as messaging };
