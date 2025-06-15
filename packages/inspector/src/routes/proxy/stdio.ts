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
import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";

const router = new Hono<ProxyEnv>().get(
  "/",
  sValidator("query", transportSchema),
  sValidator("header", transportHeaderSchema),
  async (c) => {
    console.log("New connection");
    let serverTransport: Transport
    try {
      serverTransport = await createTransport(c);
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
      c.get("webAppTransports").set(webAppTransport.sessionId, webAppTransport);
      c.get("serverTransports").set(webAppTransport.sessionId, serverTransport)

      console.log("Created client/server transports");

      webAppTransport.connectWithStream(stream);
      webAppTransport.start();

      (serverTransport as StdioClientTransport).stderr!.on("data", (chunk) => {
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
        transportToServer: serverTransport,
        ctx: c,
      });

      console.log("Set up MCP proxy");
    });
  },
);

export default router;
