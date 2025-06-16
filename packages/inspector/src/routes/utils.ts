import type { EnvWithConfig } from "@/types";
import { _generateModelKey } from "@muppet-kit/shared";
import { Hono } from "hono";

const router = new Hono<EnvWithConfig>();

router.get("/config", (c) => {
  const config = c.get("config");

  return c.json({
    tunneling: !!config.tunneling,
    enableTelemetry: config.enableTelemetry,
    models: config.models
      ? {
        default: _generateModelKey(config.models.default),
        available: Object.keys(config.models.available),
      }
      : false,
    configurations: config.configurations,
  });
});

router.get("/health", (c) => c.json({ status: "ok" }));

export default router;
