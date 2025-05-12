"use client";

import { useEffect } from "react";
import { onMessage } from "firebase/messaging";
import { messaging } from "../notifications/firebase";
import { toast } from "sonner";

export const useForegroundFCM = () => {
  useEffect(() => {
    if (!messaging) return;

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("FCM Foreground Message Received:", payload);

      // You can customize this toast
      toast(payload.notification?.title || "Notification", {
        description: payload.notification?.body,
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);
};
