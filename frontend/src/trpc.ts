import { httpLink, createTRPCProxyClient } from "@trpc/client";
import type { AppRouter } from "./server";

export const trpc = () => createTRPCProxyClient<AppRouter>({
  links: [
    httpLink({
      url: `${window.location.protocol + "//" + window.location.host}/api/trpc`,
    }),
  ],
});
