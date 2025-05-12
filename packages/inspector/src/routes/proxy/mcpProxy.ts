import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import type { Context } from "hono";
import type { ProxyEnv } from "./types";

function onClientError(error: Error) {
  console.error("Error from inspector client:", error);
}

function onServerError(error: Error) {
  console.error("Error from MCP server:", error);
}

export default function mcpProxy({
  transportToClient,
  transportToServer,
  ctx,
}: {
  transportToClient: Transport;
  transportToServer: Transport;
  ctx: Context<ProxyEnv>;
}) {
  let transportToClientClosed = false;
  let transportToServerClosed = false;

  transportToClient.onmessage = (message) => {
    ctx.get("broadcast")?.sendMessage({
      session: transportToClient.sessionId,
      from: "client",
      message,
    });
    transportToServer.send(message).catch(onServerError);
  };

  transportToServer.onmessage = (message) => {
    ctx.get("broadcast")?.sendMessage({
      session: transportToClient.sessionId,
      from: "server",
      message,
    });
    transportToClient.send(message).catch(onClientError);
  };

  transportToClient.onclose = () => {
    if (transportToServerClosed) {
      return;
    }

    transportToClientClosed = true;
    transportToServer.close().catch(onServerError);
  };

  transportToServer.onclose = () => {
    if (transportToClientClosed) {
      return;
    }
    transportToServerClosed = true;
    transportToClient.close().catch(onClientError);
  };

  transportToClient.onerror = onClientError;
  transportToServer.onerror = onServerError;
}
