import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

import FingerprintJS from "@fingerprintjs/fingerprintjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getDeviceId() {
  const fp = await FingerprintJS.load();
  const result = await fp.get();

  return result.visitorId; // This is a stable, unique identifier for the device
}

export function getDeviceType() {
  const userAgent = navigator.userAgent || navigator.vendor;
  console.log("User Agent for getDeviceType:", userAgent);

  if (/windows phone/i.test(userAgent)) {
    return "Windows Phone";
  }

  if (/android/i.test(userAgent)) {
    return "Android";
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
    return "iOS";
  }

  if (/Windows NT/i.test(userAgent)) {
    return "Windows";
  }

  if (/Mac/i.test(userAgent)) {
    return "MacOS";
  }

  return "Unknown Device";
}
