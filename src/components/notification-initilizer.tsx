"use client";

import { useEffect } from "react";
import { onMessage } from "firebase/messaging";
import { messaging } from "../notifications/firebase";
import { toast, Toaster } from "sonner";
import { CustomNotificationToast } from "./custom-notification-toast";

export const NotificationInitializer = () => {
  useEffect(() => {
    if (!messaging) return;

    const unsubscribe = onMessage(messaging, (payload) => {
      const { title = "New Notification", body = "" } =
        payload.notification ?? {};
      const image = payload.notification?.image;

      // Format timestamp
      const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      // Custom toast with our enhanced component
      toast.custom(() => (
        <CustomNotificationToast
          title={title}
          body={body}
          image={image}
          timestamp={timestamp}
          onDismiss={() => toast.dismiss()}
          onAction={() => {
            // Handle action click - can be customized based on notification type
            console.log("Notification action clicked", payload);
            toast.dismiss();
          }}
          actionText="View Details"
        />
      ));
    });

    return () => unsubscribe();
  }, []);

  return (
    <Toaster
      position="top-right"
      closeButton
      theme="light"
      toastOptions={{
        duration: 5000,
        className: "!p-0 !bg-transparent !shadow-none !border-none !max-w-md",
      }}
    />
  );
};
