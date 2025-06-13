import { sValidator } from "@hono/standard-validator";
import { SseError } from "@modelcontextprotocol/sdk/client/sse.js";
import { Hono } from "hono";
import { SSEHonoTransport, streamSSE } from "muppet/streaming";
import mcpProxy from "./mcpProxy";
import type { ProxyEnv } from "./types";
import {
  createTransport,
  transportHeaderSchema,
  transportSchema,
} from "./utils";
import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";

const router = new Hono<ProxyEnv>()
  .get(
    "/sse",
    sValidator("query", transportSchema),
    sValidator("header", transportHeaderSchema),
    async (c) => {
      console.log(
        "New SSE connection. NOTE: The sse transport is deprecated and has been replaced by streamable-http"
      );

      let serverTransport: Transport;
      try {
        serverTransport = await createTransport(c);
      } catch (error) {
        if (error instanceof SseError && error.code === 401) {
          console.error(
            "Received 401 Unauthorized from MCP server:",
            error.message
          );
          return c.json(error, 401);
        }

        throw error;
      }

      console.log("Connected MCP client to server transport");

      return streamSSE(c, async (stream) => {
        const webAppTransport = new SSEHonoTransport("/api/message");
        c.get("webAppTransports").set(webAppTransport.sessionId, webAppTransport);
        c.get("serverTransports").set(webAppTransport.sessionId, serverTransport);

        console.log("Created web app transport");

        webAppTransport.connectWithStream(stream);
        webAppTransport.start();

        mcpProxy({
          transportToClient: webAppTransport,
          transportToServer: serverTransport,
          ctx: c,
        });

        console.log("Set up MCP proxy");
      });
    }
  )
  .post("/message", async (c) => {
    const sessionId = c.req.query("sessionId");
    console.log(`Received message for sessionId ${sessionId}`);

    if (!sessionId) {
      throw new Error("Session ID is required for POST message");
    }

    const transport = c.get("webAppTransports").get(sessionId) as SSEHonoTransport;
    if (!transport) {
      return c.text("Session not found", 404);
    }
    await transport.handlePostMessage(c);
    return c.text("ok");
  });

export default router;
