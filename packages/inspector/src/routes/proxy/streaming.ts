import { SseError } from "@modelcontextprotocol/sdk/client/sse.js";
import type { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { StreamableHTTPTransport } from "@hono/mcp";
import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { validator as zValidator } from "hono-openapi/zod";
import { nanoid } from "nanoid";
import z from "zod";
import mcpProxy from "./mcpProxy";
import type { ProxyEnv } from "./types";
import {
  createTransport,
  transportHeaderSchema,
  transportSchema,
} from "./utils";

const router = new Hono<ProxyEnv>()
  .use(async (c, next) => {
    await next();
    c.header("Access-Control-Expose-Headers", "mcp-session-id");
  })
  .get(
    "/",
    describeRoute({
      description:
        "Replays an existing streaming session or establishes a new one if not found",
    }),
    zValidator(
      "header",
      z.object({
        "mcp-session-id": z.string(),
      }),
    ),
    async (c) => {
      const sessionId = c.req.valid("header")["mcp-session-id"];

      c.get("logger").info(`Received GET message for sessionId ${sessionId}`);

      const transport = c
        .get("webAppTransports")
        .get(sessionId) as StreamableHTTPTransport;
      if (!transport) {
        return c.text("Session not found", 404);
      }

      return transport.handleRequest(c);
    },
  )
  .post(
    "/",
    describeRoute({
      description: "Establishes a new streaming session with the MCP server",
    }),
    zValidator("query", transportSchema),
    zValidator("header", transportHeaderSchema),
    async (c) => {
      const sessionId = c.req.header("mcp-session-id");
      const logger = c.get("logger");
      logger.info(`Received POST message for sessionId ${sessionId}`);

      if (!sessionId) {
        logger.info("New streamable-http connection");

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

        const webAppTransport = new StreamableHTTPTransport({
          sessionIdGenerator: nanoid,
          onsessioninitialized: (sessionId) => {
            c.get("webAppTransports").set(sessionId, webAppTransport);
            c.get("serverTransports").set(sessionId, serverTransport);
            logger.info(`Created streamable web app transport ${sessionId}`);
          },
        });

        await webAppTransport.start();

        mcpProxy({
          transportToClient: webAppTransport,
          transportToServer: serverTransport,
          ctx: c,
        });

        return webAppTransport.handleRequest(c);
      }

      const transport = c
        .get("webAppTransports")
        .get(sessionId) as StreamableHTTPServerTransport;

      if (!transport) {
        c.text(`Transport not found for sessionId ${sessionId}`, 404);
      } else {
        return transport.handleRequest(c);
      }
    },
  )
  .delete(
    "/",
    describeRoute({
      description: "Terminates an existing streaming session",
    }),
    async (c) => {
      const sessionId = c.req.header("mcp-session-id");
      const logger = c.get("logger");
      logger.info(`Received DELETE message for sessionId ${sessionId}`);

      if (!sessionId) {
        return c.text("Session ID is required", 400);
      }

      const transport = c
        .get("serverTransports")
        .get(sessionId) as StreamableHTTPClientTransport;

      if (!transport) {
        return c.text(`Transport not found for sessionId ${sessionId}`, 404);
      }

      await transport.terminateSession();

      c.get("webAppTransports").delete(sessionId);
      c.get("serverTransports").delete(sessionId);
      logger.info(
        `Transport for sessionId ${sessionId} terminated and removed`,
      );

      return c.text("Session terminated successfully", 200);
    },
  );

export default router;
