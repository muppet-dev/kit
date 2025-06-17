import type { EnvWithConfig } from "@/types";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { resolver } from "hono-openapi/zod";
import z from "zod";

const router = new Hono<EnvWithConfig>();

router.get(
  "/",
  describeRoute({
    description:
      "Generates the tunneling URL using the configured tunneling handler",
    responses: {
      200: {
        description: "Generated tunneling URL",
        content: {
          "application/json": {
            schema: resolver(
              z.object({
                url: z.string().url(),
              }),
            ),
          },
        },
      },
    },
  }),
  async (c) => {
    const handler = c.get("config").tunneling;

    if (!handler) {
      return c.json({
        error: "Tunneling is not enabled",
      });
    }

    return c.json(await handler.generate({ port: c.get("config").port }));
  },
);

export default router;
