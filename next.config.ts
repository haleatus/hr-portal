/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable environment variables to be exposed to the client
  env: {
    NEXT_PUBLIC_VAPID_KEY: process.env.NEXT_PUBLIC_VAPID_KEY,
  },
  // Add these headers to prevent service worker issues
  async headers() {
    return [
      {
        // For the service worker file
        source: "/firebase-messaging-sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
