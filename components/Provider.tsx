"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import { trpc } from "@/utils/trpc";
import { useState } from "react";
import { store } from "@/redux/store";
import { Provider as ReduxProvider } from "react-redux";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
          transformer: superjson,
        }),
      ],
    }),
  );

  return (
    <SessionProvider>
      <trpc.Provider
        client={trpcClient}
        queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <ReduxProvider store={store}>{children}</ReduxProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </SessionProvider>
  );
}
