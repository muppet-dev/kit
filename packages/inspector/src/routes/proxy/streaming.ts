import { sValidator } from "@hono/standard-validator";
import { SseError } from "@modelcontextprotocol/sdk/client/sse.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { toFetchResponse, toReqRes } from "fetch-to-node";
import { Hono } from "hono";
import { nanoid } from "nanoid";
import z from "zod";
import mcpProxy from "./mcpProxy";
import type { ProxyEnv } from "./types";
import {
  createTransport,
  transportHeaderSchema,
  transportSchema,
} from "./utils";
import type { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";

const router = new Hono<ProxyEnv>()
  .use(async (c, next) => {
    await next();
    c.header("Access-Control-Expose-Headers", "mcp-session-id");
  })
  .get(
    "/",
    sValidator(
      "header",
      z.object({
        "mcp-session-id": z.string(),
      })
    ),
    async (c) => {
      const sessionId = c.req.valid("header")["mcp-session-id"];
      console.log(`Received GET message for sessionId ${sessionId}`);

      const transport = c
        .get("webAppTransports")
        .get(sessionId) as StreamableHTTPServerTransport;
      if (!transport) {
        return c.text("Session not found", 404);
      }

      const { req, res } = toReqRes(c.req.raw);
      await transport.handleRequest(req, res);

      return toFetchResponse(res);
    }
  )
  .post(
    "/",
    sValidator("query", transportSchema),
    sValidator("header", transportHeaderSchema),
    async (c) => {
      const sessionId = c.req.header("mcp-session-id");
      console.log(`Received POST message for sessionId ${sessionId}`);

      if (!sessionId) {
        console.log("New streamable-http connection");

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

        console.log("Connected MCP client to backing server transport");

        const webAppTransport = new StreamableHTTPServerTransport({
          sessionIdGenerator: nanoid,
          onsessioninitialized: (sessionId) => {
            c.get("webAppTransports").set(sessionId, webAppTransport);
            c.get("serverTransports").set(sessionId, serverTransport);
            console.log(`Created streamable web app transport ${sessionId}`);
          },
        });

        await webAppTransport.start();

        mcpProxy({
          transportToClient: webAppTransport,
          transportToServer: serverTransport,
          ctx: c,
        });

        const { req, res } = toReqRes(c.req.raw);
        await webAppTransport.handleRequest(req, res, await c.req.json());

        return toFetchResponse(res);
      }

      const transport = c
        .get("webAppTransports")
        .get(sessionId) as StreamableHTTPServerTransport;

      if (!transport) {
        c.text(`Transport not found for sessionId ${sessionId}`, 404);
      } else {
        const { req, res } = toReqRes(c.req.raw);
        await transport.handleRequest(req, res);

        return toFetchResponse(res);
      }
    }
  ).delete("/", async (c) => {
    const sessionId = c.req.header("mcp-session-id");
    console.log(`Received DELETE message for sessionId ${sessionId}`);

    if (!sessionId) {
      return c.text("Session ID is required", 400);
    }

    const transport = c
      .get("serverTransports")
      .get(sessionId) as StreamableHTTPClientTransport

    if (!transport) {
      return c.text(`Transport not found for sessionId ${sessionId}`, 404);
    }

    await transport.terminateSession();

    c.get("webAppTransports").delete(sessionId);
    c.get("serverTransports").delete(sessionId);
    console.log(`Transport for sessionId ${sessionId} terminated and removed`);

    return c.text("Session terminated successfully", 200);
  })

export default router;
