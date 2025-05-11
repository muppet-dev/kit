import type { EnvWithConfig } from "@/types";
import { Hono } from "hono";

const router = new Hono<EnvWithConfig>();

router.get("/config", (c) => {
  const config = c.get("config");

  return c.json({
    tunneling: !!config.tunneling?.apiKey,
    models: config.models ? Object.keys(config.models.available) : false,
    configurations: config.configurations,
  });
});

router.get("/health", (c) => {
  return c.json({ status: "ok" });
});

export default router;
