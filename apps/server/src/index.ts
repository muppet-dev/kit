import { Hono } from "hono";
import { validator } from "hono-openapi/zod";
import { openAPISpecs } from "hono-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { MCPAnalysisType, payloadSchema } from "./validations";
import { contextStorage } from "hono/context-storage";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import * as handlers from "./handlers";
import type { InspectorEnv } from "./types";

const app = new Hono<InspectorEnv>().use(contextStorage());

app.post("/", validator("json", payloadSchema), async (c) => {
  const { url, bearer, analysisType } = c.req.valid("json");

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

  let prompts: string[] = [];

  switch (analysisType) {
    case MCPAnalysisType.TOOL_INJECTION:
      prompts = await handlers.toolInjection();
      break;

    default:
      break;
  }

  if (prompts.length === 0) {
    return c.json({ error: "No prompts found" }, 400);
  }

  console.log(prompts[0]);

  const response = await Promise.all(
    prompts.map((prompt) =>
      c.env.AI.run(
        "@cf/meta/llama-4-scout-17b-16e-instruct",
        {
          prompt,
        },
        {
          gateway: {
            id: "mcp-mavens",
            skipCache: false,
            cacheTtl: 3360,
          },
        },
      ),
    ),
  );

  return c.json(response, 200);
});

app.get(
  "/openapi.json",
  openAPISpecs(app, {
    documentation: {
      info: {
        title: "MCP Inspector",
        version: "1.0.0",
      },
    },
  }),
);

app.get(
  "/docs",
  Scalar({
    theme: "saturn",
    url: "/openapi.json",
  }),
);

export default app;
