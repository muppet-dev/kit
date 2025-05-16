import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import {
  Transport as MuppetTransport,
  remoteTransportSchema,
  stdioTransportSchema,
} from "@muppet-kit/shared";
import type { Context, Env } from "hono";
import { parse as shellParseArgs } from "shell-quote";
import { findActualExecutable } from "spawn-rx";
import z from "zod";

const SSE_HEADERS_PASSTHROUGH = ["authorization"] as const;
const STREAMABLE_HTTP_HEADERS_PASSTHROUGH = [
  "authorization",
  "mcp-session-id",
  "last-event-id",
] as const;

export const transportSchema = z.union([
  stdioTransportSchema
    .pick({
      type: true,
      command: true,
    })
    .extend({
      args: z
        .string()
        .optional()
        .transform((val) => shellParseArgs(val ?? "")),
      env: z
        .string()
        .optional()
        .transform((val) => (val ? JSON.parse(val) : {})),
    }),
  remoteTransportSchema.pick({
    type: true,
    url: true,
  }),
]);

export const transportHeaderSchema = z.object({
  authorization: z.string().optional(),
});

export async function createTransport<
  E extends Env,
  P extends string,
  I extends {
    in: {
      query: z.input<typeof transportSchema>;
      header: z.input<typeof transportHeaderSchema>;
    };
    out: {
      query: z.output<typeof transportSchema>;
      header: z.output<typeof transportHeaderSchema>;
    };
  },
>(c: Context<E, P, I>) {
  const query = c.req.valid("query");

  if (query.type === MuppetTransport.STDIO) {
    const queryEnv = query.env ?? {};

    const env = {
      ...process.env,
      ...queryEnv,
    };

    const { cmd, args } = findActualExecutable(
      query.command,
      query.args as string[],
    );

    console.log(`Stdio transport: command=${cmd}, args=${args}`);

    const transport = new StdioClientTransport({
      command: cmd,
      args,
      env,
      stderr: "pipe",
    });

    await transport.start();

    console.log("Spawned stdio transport");
    return transport;
  }

  if (query.type === MuppetTransport.SSE) {
    const headers: HeadersInit = {
      Accept: "text/event-stream",
    };

    for (const key of SSE_HEADERS_PASSTHROUGH) {
      const value = c.req.header(key);

      if (value === undefined) {
        continue;
      }

      headers[key] = Array.isArray(value) ? value[value.length - 1] : value;
    }

    console.log(
      `SSE transport: url=${query.url}, headers=${Object.keys(headers)}`,
    );

    const transport = new SSEClientTransport(new URL(query.url), {
      eventSourceInit: {
        fetch: (url, init) => fetch(url, { ...init, headers }),
      },
      requestInit: {
        headers,
      },
    });

    await transport.start();

    console.log("Connected to SSE transport");
    return transport;
  }

  if (query.type === MuppetTransport.HTTP) {
    const headers: HeadersInit = {
      Accept: "text/event-stream, application/json",
    };

    for (const key of STREAMABLE_HTTP_HEADERS_PASSTHROUGH) {
      const value = c.req.header(key);

      if (value === undefined) {
        continue;
      }

      headers[key] = Array.isArray(value) ? value[value.length - 1] : value;
    }

    console.log(
      `HTTP Streaming transport: url=${query.url}, headers=${Object.keys(headers)}`,
    );

    const transport = new StreamableHTTPClientTransport(new URL(query.url), {
      requestInit: {
        headers,
      },
    });

    await transport.start();

    console.log("Connected to Streamable HTTP transport");
    return transport;
  }

  console.error(`Invalid transport type: ${query.type}`);
  throw new Error("Invalid transport type specified");
}
