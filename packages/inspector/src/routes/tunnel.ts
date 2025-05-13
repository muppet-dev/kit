import type { EnvWithConfig } from "@/types";
import { disconnect, forward } from "@ngrok/ngrok";
import { Hono } from "hono";

const router = new Hono<EnvWithConfig>();

router.get("/", async (c) => {
  const handler = c.get("config").tunneling;

  if (!handler) {
    return c.json({
      error: "Tunneling is not enabled",
    });
  }

  return c.json(await handler.generate({ port: c.get("config").port }));
});

export default router;
