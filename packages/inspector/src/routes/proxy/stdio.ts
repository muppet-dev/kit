import { SseError } from "@modelcontextprotocol/sdk/client/sse.js";
import type { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { validator as zValidator } from "hono-openapi/zod";
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
  describeRoute({
    description: "Establishes a new STDIO connection with the MCP server",
  }),
  zValidator("query", transportSchema),
  zValidator("header", transportHeaderSchema),
  async (c) => {
    const logger = c.get("logger");
    logger.info("New connection");
    let serverTransport: Transport;
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

    logger.info("Connected MCP client to backing server transport");

    return streamSSE(c, async (stream) => {
      const webAppTransport = new SSEHonoTransport("/api/message");
      c.get("webAppTransports").set(webAppTransport.sessionId, webAppTransport);
      c.get("serverTransports").set(webAppTransport.sessionId, serverTransport);

      logger.info("Created client/server transports");

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

      logger.info("Set up MCP proxy");
    });
  },
);

export default router;
