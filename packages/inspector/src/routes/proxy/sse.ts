import { SseError } from "@modelcontextprotocol/sdk/client/sse.js";
import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { validator as zValidator } from "hono-openapi/zod";
import { SSEHonoTransport, streamSSE } from "muppet/streaming";
import mcpProxy from "./mcpProxy";
import type { ProxyEnv } from "./types";
import {
  createTransport,
  transportHeaderSchema,
  transportSchema,
} from "./utils";

const router = new Hono<ProxyEnv>()
  .get(
    "/sse",
    describeRoute({
      description: "Establishes a new SSE connection with the MCP server",
    }),
    zValidator("query", transportSchema),
    zValidator("header", transportHeaderSchema),
    async (c) => {
      const logger = c.get("logger");
      logger.info(
        "New SSE connection. NOTE: The sse transport is deprecated and has been replaced by streamable-http",
      );

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

      logger.info("Connected MCP client to server transport");

      return streamSSE(c, async (stream) => {
        const webAppTransport = new SSEHonoTransport("/api/message");
        c.get("webAppTransports").set(
          webAppTransport.sessionId,
          webAppTransport,
        );
        c.get("serverTransports").set(
          webAppTransport.sessionId,
          serverTransport,
        );

        logger.info("Created web app transport");

        webAppTransport.connectWithStream(stream);
        webAppTransport.start();

        mcpProxy({
          transportToClient: webAppTransport,
          transportToServer: serverTransport,
          ctx: c,
        });

        logger.info("Set up MCP proxy");
      });
    },
  )
  .post(
    "/message",
    describeRoute({
      description: "Handles POST messages for an existing SSE session",
    }),
    async (c) => {
      const sessionId = c.req.query("sessionId");
      c.get("logger").info(`Received message for sessionId ${sessionId}`);

      if (!sessionId) {
        throw new Error("Session ID is required for POST message");
      }

      const transport = c
        .get("webAppTransports")
        .get(sessionId) as SSEHonoTransport;
      if (!transport) {
        return c.text("Session not found", 404);
      }
      await transport.handlePostMessage(c);
      return c.text("ok");
    },
  );

export default router;
