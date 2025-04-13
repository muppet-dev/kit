import { DurableObject } from "cloudflare:workers";
import type { Env } from "hono";
import { SSEHonoTransport } from "muppet/streaming";
import app from "./app";
import server from "./mcp";

export class MCPObject extends DurableObject<Env> {
  transport?: SSEHonoTransport;

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    this.transport = new SSEHonoTransport("/mcp/messages", ctx.id.toString());
  }

  async fetch(request: Request) {
    return server.fetch(request, {
      ...this.env,
      transport: this.transport,
    });
  }
}

export default {
  async fetch(
    request: Request,
    env: { MCP: DurableObjectNamespace<MCPObject> },
    ctx: ExecutionContext,
  ): Promise<Response> {
    const url = new URL(request.url);

    if (!url.pathname.startsWith("/mcp")) return app.fetch(request, env, ctx);

    const sessionId = url.searchParams.get("sessionId");

    const namespace = env.MCP;

    let stub: DurableObjectStub<MCPObject>;

    if (sessionId) stub = namespace.get(namespace.idFromString(sessionId));
    else stub = namespace.get(namespace.newUniqueId());

    return stub.fetch(request);
  },
};
