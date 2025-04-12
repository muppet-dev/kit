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

  let response: Record<string, unknown>;

  switch (analysisType) {
    case MCPAnalysisType.TOOL_CALL:
      response = await handlers.toolCall();
      break;

    case MCPAnalysisType.RESOURCE_ACCESS:
      response = await handlers.resourceAccess();
      break;

    case MCPAnalysisType.PROMPT_INJECTION:
      response = await handlers.promptInjection();
      break;

    default:
      response = {
        message: "Unable to find the the analysis function for this",
      };
      break;
  }

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
