/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect } from "react";
import { onMessage } from "firebase/messaging";
import { messaging } from "../notifications/firebase";
import { toast, Toaster } from "sonner";
import Image from "next/image";
import { Bell } from "lucide-react";

export const NotificationInitializer = () => {
  useEffect(() => {
    if (!messaging) return;

    const unsubscribe = onMessage(messaging, (payload) => {
      const { title = "🔔 New Notification", body = "" } =
        payload.notification ?? {};

      toast.custom((t) => (
        <div
          className={`text-black dark:text-white px-6 py-2 rounded-lg shadow-lg flex items-center gap-4 animate-slide-in`}
        >
          <div className="flex-shrink-0">
            {payload.notification?.image ? (
              <Image
                src={payload.notification.image}
                alt="icon"
                className="w-6 h-6 rounded-full"
                unoptimized
                height={24}
                width={24}
              />
            ) : (
              <Bell className="w-3 h-3 text-white" />
            )}
          </div>
          <div>
            <p className="font-semibold text-base">{title}</p>
            <p className="text-sm opacity-90">{body}</p>
          </div>
        </div>
      ));
    });

    return () => unsubscribe();
  }, []);

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        classNames: {
          toast: "transition-all duration-300 ease-in-out",
        },
      }}
    />
  );
};
