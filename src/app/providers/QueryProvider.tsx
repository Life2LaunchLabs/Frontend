import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
      retry: (failureCount, error: unknown) => {
        // Don't retry on auth errors
        if ((error as any)?.status === 401 || (error as any)?.status === 403) {
          return false;
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: (failureCount, error: unknown) => {
        // Don't retry mutations on client errors
        if ((error as any)?.status >= 400 && (error as any)?.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};