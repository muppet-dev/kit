import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import { Hono } from "hono";
import { streamSSE } from "muppet/streaming";
import { Broadcast } from "./broadcast";
import sseRouter from "./sse";
import stdioRouter from "./stdio";
import streamingRouter from "./streaming";
import type { ProxyEnv } from "./types";

const webAppTransports: Map<string, Transport> = new Map<string, Transport>();
let backingServerTransport: Transport | undefined;
const broadcast = new Broadcast();

const router = new Hono<ProxyEnv>().use(async (c, next) => {
  c.set("transports", webAppTransports);
  c.set("backing", backingServerTransport);
  c.set("broadcast", broadcast);

  await next();
});

router.get("/subscribe", (c) =>
  streamSSE(c, async (stream) => {
    c.get("broadcast").addStream(stream);
  }),
);
router.route("/mcp", streamingRouter);
router.route("/stdio", stdioRouter);
router.route("/", sseRouter);

export default router;
