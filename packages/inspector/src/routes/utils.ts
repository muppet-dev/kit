import type { EnvWithConfig } from "@/types";
import { _generateModelKey, transportSchema } from "@muppet-kit/shared";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { resolver } from "hono-openapi/zod";
import z from "zod";
import { getRuntimeKey } from "hono/adapter";

const router = new Hono<EnvWithConfig>();

router.get(
  "/config",
  describeRoute({
    description: "Get the current configuration of the inspector",
    responses: {
      200: {
        description: "Configuration retrieved successfully",
        content: {
          "application/json": {
            schema: resolver(
              z.object({
                tunneling: z.boolean(),
                enableTelemetry: z.boolean(),
                models: z
                  .object({
                    default: z.string(),
                    available: z.array(z.string()),
                  })
                  .optional(),
                configurations: z.union([
                  transportSchema,
                  z.array(transportSchema),
                ]),
              }),
            ),
          },
        },
      },
    },
  }),
  (c) => {
    const config = c.get("config");

    return c.json({
      tunneling: !!config.tunneling,
      enableTelemetry: config.enableTelemetry ?? true,
      models: config.models
        ? {
            default: _generateModelKey(config.models.default),
            available: Object.keys(config.models.available),
          }
        : undefined,
      configurations: config.configurations,
      runtime: getRuntimeKey(),
    });
  },
);

router.get(
  "/health",
  describeRoute({
    description: "Check the health of the inspector",
    responses: {
      200: {
        description: "Inspector is healthy",
        content: {
          "application/json": {
            schema: resolver(
              z.object({
                status: z.string(),
              }),
            ),
          },
        },
      },
    },
  }),
  (c) => c.json({ status: "ok" }),
);

export default router;
