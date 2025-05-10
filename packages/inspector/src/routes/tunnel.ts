import type { EnvWithConfig } from "@/types";
import { forward, disconnect } from "@ngrok/ngrok";
import { Hono } from "hono";

const router = new Hono<EnvWithConfig>();

router.get("/", async (c) => {
  const apiKey = c.get("config").tunneling?.apiKey;

  if (!apiKey) {
    return c.json({
      error: "Tunneling is not enabled",
    });
  }

  // Disconnecting all existing tunnels
  await disconnect();

  // Creating a new tunnel
  const listener = await forward({
    addr: 3000,
    authtoken: apiKey,
  });

  return c.json({
    url: listener.url(),
  });
});

export default router;
