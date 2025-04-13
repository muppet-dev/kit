import { Hono } from "hono";
import { validator } from "hono-openapi/zod";
import { MCPAnalysisType, payloadSchema } from "./validations";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import type { InspectorEnv } from "./types";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import * as handlers from "./handlers";
import { contextStorage } from "hono/context-storage";
import type { z } from "zod";

const router = new Hono<
  InspectorEnv,
  {
    in: {
      json: z.input<typeof payloadSchema>;
    };
    out: {
      json: z.infer<typeof payloadSchema>;
    };
  }
>().use(contextStorage(), validator("json", payloadSchema), async (c, next) => {
  // @ts-expect-error
  const { url, bearer } = c.req.valid("json");

  const client = new Client({
    name: "mcp-inspector",
    version: "1.0.0",
  });

  await client.connect(
    new SSEClientTransport(new URL(url), {
      requestInit: bearer
        ? {
            headers: {
              Authorization: `Bearer ${bearer}`,
            },
          }
        : undefined,
    }),
  );

  c.set("client", client);

  await next();
});

router.get("/", (c) => {
  return c.json({ status: "connected" }, 200);
});

router.post("/", async (c) => {
  // @ts-expect-error
  const { analysisType } = c.req.valid("json");
  let responses: Record<string, unknown>[] = [];

  switch (analysisType) {
    case MCPAnalysisType.TOOL_INJECTION:
      responses = await handlers.toolInjection();
      break;

    default:
      break;
  }

  return c.json(responses, 200);
});

export default router;
