import { Hono } from "hono";
import { bridge, muppet } from "muppet";
import { type SSEHonoTransport, streamSSE } from "muppet/streaming";
import app from "./app";

const server = new Hono<{
  Bindings: { transport: SSEHonoTransport };
}>().basePath("/mcp");

server.get("/sse", (c) => {
  return streamSSE(c, async (stream) => {
    c.env.transport.connectWithStream(stream);

    await bridge({
      mcp: muppet(app, {
        name: "mcp-inspector",
        version: "1.0.0",
      }),
      transport: c.env.transport,
    });
  });
});

server.post("/messages", async (c) => {
  const transport = c.env.transport;

  if (!transport) {
    throw new Error("Transport not initialized");
  }

  await transport.handlePostMessage(c);
  return c.text("ok");
});

export default server;
