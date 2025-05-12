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
      }),
    ),
    async (c) => {
      const sessionId = c.req.valid("header")["mcp-session-id"];
      console.log(`Received GET message for sessionId ${sessionId}`);

      const transport = c
        .get("transports")
        .get(sessionId) as StreamableHTTPServerTransport;
      if (!transport) {
        return c.text("Session not found", 404);
      }

      const { req, res } = toReqRes(c.req.raw);
      await transport.handleRequest(req, res);

      return toFetchResponse(res);
    },
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

        const webAppTransport = new StreamableHTTPServerTransport({
          sessionIdGenerator: nanoid,
          onsessioninitialized: (sessionId) => {
            c.get("transports").set(sessionId, webAppTransport);
            console.log(`Created streamable web app transport ${sessionId}`);
          },
        });

        await webAppTransport.start();

        mcpProxy({
          transportToClient: webAppTransport,
          transportToServer: c.get("backing")!,
          ctx: c,
        });

        const { req, res } = toReqRes(c.req.raw);
        await (webAppTransport as StreamableHTTPServerTransport).handleRequest(
          req,
          res,
          await c.req.json(),
        );

        return toFetchResponse(res);
      }

      const transport = c
        .get("transports")
        .get(sessionId) as StreamableHTTPServerTransport;

      if (!transport) {
        c.text(`Transport not found for sessionId ${sessionId}`, 404);
      } else {
        const { req, res } = toReqRes(c.req.raw);
        await (transport as StreamableHTTPServerTransport).handleRequest(
          req,
          res,
        );

        return toFetchResponse(res);
      }
    },
  );

export default router;
