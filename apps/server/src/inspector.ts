import { Hono, type MiddlewareHandler } from "hono";
import { validator } from "hono-openapi/zod";
import { MCPAnalysisType, payloadSchema } from "./validations";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import type { InspectorEnv } from "./types";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import * as handlers from "./handlers";
import { contextStorage } from "hono/context-storage";
import type { z } from "zod";

const router = new Hono<InspectorEnv>().use(contextStorage());

const clientHandler: MiddlewareHandler<
  InspectorEnv,
  "/",
  {
    in: {
      json: z.input<typeof payloadSchema>;
    };
    out: {
      json: z.infer<typeof payloadSchema>;
    };
  }
> = async (c, next) => {
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
};

router.post(
  "/check",
  validator(
    "json",
    payloadSchema.omit({
      analysisType: true,
    }),
  ),
  clientHandler,
  (c) => {
    return c.json({ status: "connected" }, 200);
  },
);

router.post("/", validator("json", payloadSchema), clientHandler, async (c) => {
  const { analysisType } = c.req.valid("json");
  let responses: Record<string, unknown>[] = [];

  switch (analysisType) {
    case MCPAnalysisType.TOOL_INJECTION:
      responses = await handlers.toolInjection();
      break;

    case MCPAnalysisType.PROMPT_INJECTION:
      responses = await handlers.promptInjection();
      break;

    default:
      break;
  }

  return c.json(responses, 200);
});

export default router;
