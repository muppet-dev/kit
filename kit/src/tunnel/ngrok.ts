import type { TunnelHandler } from "@muppet-kit/shared";
import { disconnect, forward } from "@ngrok/ngrok";

/**
 * Ngrok tunnel handler
 */
export function ngrok(options?: { apiKey?: string }): TunnelHandler {
  return {
    generate: async ({ port }) => {
      // Disconnecting all existing tunnels
      await disconnect();

      // Creating a new tunnel
      const listener = await forward({
        addr: port,
        authtoken: options?.apiKey ?? process.env.NGROK_API_KEY,
      });

      return {
        url: listener.url(),
      };
    },
  };
}
