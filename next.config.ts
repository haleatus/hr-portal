/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable environment variables to be exposed to the client
  env: {
    NEXT_PUBLIC_VAPID_KEY: process.env.NEXT_PUBLIC_VAPID_KEY,
  },
};

export default nextConfig;
