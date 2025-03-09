"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, ReactNode } from "react";

/**
 * Props for the QueryProvider component
 * @interface QueryProviderProps
 * @property {ReactNode} children - Child components that will have access to the QueryClient
 */
interface QueryProviderProps {
  children: ReactNode;
}

/**
 * QueryProvider component that sets up TanStack Query for the application
 *
 * This component initializes a QueryClient instance and provides it to all
 * child components through the React context API. It also includes the
 * ReactQueryDevtools for development debugging.
 *
 * @param {QueryProviderProps} props - Component props
 * @returns {JSX.Element} The provider wrapped around children components
 */
export default function QueryProvider({ children }: QueryProviderProps) {
  // Create a new QueryClient instance and store it in state
  // Using useState with a factory function ensures it's only created once
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Configure how long data remains "fresh" before refetching
            // Here, data is considered fresh for 1 minute (60,000 milliseconds)
            staleTime: 60 * 1000,

            // Other useful options you could configure:
            gcTime: 5 * 60 * 1000, // How long unused data stays in cache (5 minutes)
            // refetchOnWindowFocus: true, // Auto-refetch when window regains focus
            refetchOnReconnect: true, // Auto-refetch when reconnecting after offline
            retry: 3, // Number of times to retry failed queries
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {/* Render all child components with access to the query client */}
      {children}

      {/* 
        React Query Devtools - development tool for inspecting queries
        - Provides a UI panel to monitor all queries and their states
        - Only included in development builds by default
        - initialIsOpen={false} means the devtools panel starts collapsed
      */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
