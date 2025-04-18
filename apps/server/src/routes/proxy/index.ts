import { SseError } from "@modelcontextprotocol/sdk/client/sse.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import { type Context, type Env, Hono } from "hono";
import mcpProxy from "./mcpProxy";
import { findActualExecutable } from "spawn-rx";
import { SSEHonoTransport } from "muppet/streaming";
import { zValidator } from "@hono/zod-validator";
import { transportHeaderSchema, transportSchema } from "@/validations";
import type { z } from "zod";

const router = new Hono();

const webAppTransports: SSEHonoTransport[] = [];
const SSE_HEADERS_PASSTHROUGH = ["authorization"];

async function createTransport<
  E extends Env,
  P extends string,
  I extends {
    in: {
      query: z.input<typeof transportSchema>;
      header: z.input<typeof transportHeaderSchema>;
    };
    out: {
      query: z.output<typeof transportSchema>;
      header: z.output<typeof transportHeaderSchema>;
    };
  },
>(c: Context<E, P, I>) {
  const query = c.req.valid("query");

  if (query.transportType === "stdio") {
    const queryEnv = query.env ?? {};

    const env = {
      ...process.env,
      ...queryEnv,
    };

    const { cmd, args } = findActualExecutable(
      query.command,
      query.args as string[],
    );

    const transport = new StdioClientTransport({
      command: cmd,
      args,
      env,
      stderr: "pipe",
    });

    await transport.start();

    return transport;
  }

  if (query.transportType === "sse") {
    const headers: Record<string, unknown> = {
      Accept: "text/event-stream",
    };

    for (const key of SSE_HEADERS_PASSTHROUGH) {
      const value = c.req.header(key);

      if (value === undefined) {
        continue;
      }

      headers[key] = Array.isArray(value) ? value[value.length - 1] : value;
    }

    const transport = new SSEHonoTransport(query.url);

    await transport.start();

    return transport;
  }
}

let backingServerTransport: Transport | undefined;

router.get(
  "/sse",
  zValidator("query", transportSchema),
  zValidator("header", transportHeaderSchema),
  async (c) => {
    try {
      await backingServerTransport?.close();
      backingServerTransport = await createTransport(c);
    } catch (err) {
      if (err instanceof SseError && err.code === 401) {
        console.error(
          "Received 401 Unauthorized from MCP server:",
          err.message,
        );
        return c.json(err, 401);
      }

      throw err;
    }

    console.log("Connected MCP client to backing server transport");

    const webAppTransport = new SSEHonoTransport("/message");
    console.log("Created web app transport");

    webAppTransports.push(webAppTransport);
    console.log("Created web app transport");

    await webAppTransport.start();

    if (backingServerTransport instanceof StdioClientTransport) {
      backingServerTransport.stderr!.on("data", (chunk) => {
        webAppTransport.send({
          jsonrpc: "2.0",
          method: "notifications/stderr",
          params: {
            content: chunk.toString(),
          },
        });
      });
    }

    if (!backingServerTransport) {
      throw new Error("Unable to create backing server transport");
    }

    mcpProxy({
      transportToClient: webAppTransport,
      transportToServer: backingServerTransport,
    });
  },
);

router.post("/message", async (c) => {
  const sessionId = c.req.query("sessionId");
  console.log(`Received message for sessionId ${sessionId}`);

  const transport = webAppTransports.find((t) => t.sessionId === sessionId);
  if (!transport) {
    return c.text("Session not found", 404);
  }
  await transport.handlePostMessage(c);
});

router.get("/health", (c) => c.json({ status: "ok" }));

router.get("/config", (c) => {
  return c.text("Need to implement this!");
});

export default router;
