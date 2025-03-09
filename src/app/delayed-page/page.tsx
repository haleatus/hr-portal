// This is a Server Component that artificially delays loading
async function getData() {
  // Simulate a slow data fetch with a 3 second delay
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return {
    title: "Data Loaded Successfully",
    message: "This page took 3 seconds to load, demonstrating the loading UI.",
  };
}

import Link from "next/link";

export default async function DelayedPage() {
  // This will trigger the loading state for 3 seconds
  const data = await getData();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="max-w-md w-full p-6 bg-card rounded-lg shadow-lg border border-border">
        <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
        <p className="text-muted-foreground mb-6">{data.message}</p>

        <Link
          href="/"
          className="text-primary rounded-lg bg-black px-4 py-2 text-white hover:text-blue-400 duration-300 transition-colors"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
