import { sValidator } from "@hono/standard-validator";
import { SseError } from "@modelcontextprotocol/sdk/client/sse.js";
import type { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { Hono } from "hono";
import { SSEHonoTransport, streamSSE } from "muppet/streaming";
import mcpProxy from "./mcpProxy.js";
import type { ProxyEnv } from "./types.js";
import {
  createTransport,
  transportHeaderSchema,
  transportSchema,
} from "./utils.js";

const router = new Hono<ProxyEnv>().get(
  "/",
  sValidator("query", transportSchema),
  sValidator("header", transportHeaderSchema),
  async (c) => {
    console.log("New connection");

    try {
      await c.get("backing")?.close();
      c.set("backing", await createTransport(c));
    } catch (error) {
      if (error instanceof SseError && error.code === 401) {
        console.error(
          "Received 401 Unauthorized from MCP server:",
          error.message,
        );
        return c.json(error, 401);
      }

      throw error;
    }

    console.log("Connected MCP client to backing server transport");

    return streamSSE(c, async (stream) => {
      const webAppTransport = new SSEHonoTransport("/api/message");
      c.get("transports").set(webAppTransport.sessionId, webAppTransport);

      console.log("Created web app transport");

      webAppTransport.connectWithStream(stream);
      webAppTransport.start();

      (c.get("backing") as StdioClientTransport).stderr!.on("data", (chunk) => {
        webAppTransport.send({
          jsonrpc: "2.0",
          method: "notifications/stderr",
          params: {
            content: chunk.toString(),
          },
        });
      });

      mcpProxy({
        transportToClient: webAppTransport,
        transportToServer: c.get("backing")!,
        ctx: c,
      });

      console.log("Set up MCP proxy");
    });
  },
);

export default router;
