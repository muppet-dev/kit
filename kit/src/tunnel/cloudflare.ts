import type { TunnelHandler } from "@muppet-kit/shared";
import { startTunnel } from "untun";

export function cloudflare(): TunnelHandler {
  return {
    generate: async ({ port }) => {
      // Creating a new tunnel
      const listener = await startTunnel({
        port,
      });

      return {
        url: (await listener?.getURL()) ?? null,
      };
    },
  };
}
