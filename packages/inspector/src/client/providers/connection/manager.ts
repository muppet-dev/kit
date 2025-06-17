import { auth } from "@modelcontextprotocol/sdk/client/auth.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import {
  SSEClientTransport,
  SseError,
} from "@modelcontextprotocol/sdk/client/sse.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { RequestOptions } from "@modelcontextprotocol/sdk/shared/protocol.js";
import {
  CancelledNotificationSchema,
  type ClientNotification,
  type ClientRequest,
  CompleteResultSchema,
  CreateMessageRequestSchema,
  ErrorCode,
  ListRootsRequestSchema,
  LoggingMessageNotificationSchema,
  McpError,
  type Progress,
  PromptListChangedNotificationSchema,
  type PromptReference,
  type Request,
  ResourceListChangedNotificationSchema,
  type ResourceReference,
  ResourceUpdatedNotificationSchema,
  type Result,
  type ServerCapabilities,
  ToolListChangedNotificationSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { Transport } from "@muppet-kit/shared";
import { nanoid } from "nanoid";
import { useState } from "react";
import toast from "react-hot-toast";
import type z from "zod";
import { type Notification, StdErrNotificationSchema } from "../../types";
import type { configTransportSchema } from "../../validations";
import { useConfig } from "../config";
import { InspectorOAuthClientProvider } from "./auth";

export type ConnectionInfo = z.infer<typeof configTransportSchema>;

export type UseConnectionOptions = ConnectionInfo & {
  proxy: string;
  onNotification?: (notification: Notification) => void;
  onStdErrNotification?: (notification: Notification) => void;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  onPendingRequest?: (request: any, resolve: any, reject: any) => void;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  getRoots?: () => any[];
};

export enum ConnectionStatus {
  DISCONNECTED = "disconnected",
  CONNECTED = "connected",
  CONNECTING = "connecting",
  ERROR = "error",
  ERROR_CONNECTING_TO_PROXY = "error-connecting-to-proxy",
}

export type RequestHistory = {
  id: string;
  timestamp: {
    start: number;
    latency: number;
  };
  request: string;
  response?: string;
};

export function useConnectionManager(props: UseConnectionOptions) {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    ConnectionStatus.DISCONNECTED,
  );
  const [serverCapabilities, setServerCapabilities] =
    useState<ServerCapabilities | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [mcpClient, setMcpClient] = useState<Client | null>(null);
  const [clientTransport, setClientTransport] = useState<
    StreamableHTTPClientTransport | SSEClientTransport | null
  >(null);
  const [requestHistory, setRequestHistory] = useState<RequestHistory[]>([]);
  const [completionsSupported, setCompletionsSupported] = useState(true);
  const { setConnectionLink } = useConfig();

  const pushHistory = (
    timestamp: number,
    request: object,
    response?: object,
  ) => {
    setRequestHistory((prev) => [
      ...prev,
      {
        id: nanoid(),
        timestamp: {
          start: Date.now(),
          latency: performance.now() - timestamp,
        },
        request: JSON.stringify(request),
        response: response !== undefined ? JSON.stringify(response) : undefined,
      },
    ]);
  };

  const makeRequest = async <T extends z.ZodType>(
    request: ClientRequest,
    schema: T,
    options?: RequestOptions & { suppressToast?: boolean },
  ): Promise<z.output<T>> => {
    if (!mcpClient) {
      throw new Error("MCP client not connected");
    }

    try {
      const abortController = new AbortController();
      // prepare MCP Client request options
      const mcpRequestOptions: RequestOptions = {
        signal: options?.signal ?? abortController.signal,
        resetTimeoutOnProgress:
          options?.resetTimeoutOnProgress ?? props.progress,
        timeout: options?.timeout ?? props.request_timeout,
        maxTotalTimeout: options?.maxTotalTimeout ?? props.total_timeout,
      };

      if (mcpRequestOptions.resetTimeoutOnProgress) {
        // If progress notifications are enabled, add an onprogress hook to the MCP Client request options
        // This is required by SDK to reset the timeout on progress notifications
        mcpRequestOptions.onprogress = (params: Progress) => {
          // Add progress notification to `Server Notification` window in the UI
          if (props.onNotification) {
            props.onNotification({
              method: "notification/progress",
              params,
            });
          }
        };
      }

      let response: z.output<T>;
      const timestamp = performance.now();
      try {
        response = await mcpClient.request(request, schema, mcpRequestOptions);
        pushHistory(timestamp, request, response);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        pushHistory(timestamp, request, { error: errorMessage });
        throw error;
      }

      return response;
    } catch (e: unknown) {
      if (!options?.suppressToast) {
        const errorString = (e as Error).message ?? String(e);
        toast.error(errorString);
      }
      throw e;
    }
  };

  const handleCompletion = async (
    ref: ResourceReference | PromptReference,
    argName: string,
    value: string,
    signal?: AbortSignal,
  ): Promise<string[]> => {
    if (!mcpClient || !completionsSupported) {
      return [];
    }

    const request: ClientRequest = {
      method: "completion/complete",
      params: {
        argument: {
          name: argName,
          value,
        },
        ref,
      },
    };

    try {
      const response = await makeRequest(request, CompleteResultSchema, {
        signal,
        suppressToast: true,
      });
      return response?.completion.values || [];
    } catch (e: unknown) {
      // Disable completions silently if the server doesn't support them.
      // See https://github.com/modelcontextprotocol/specification/discussions/122
      if (e instanceof McpError && e.code === ErrorCode.MethodNotFound) {
        setCompletionsSupported(false);
        return [];
      }

      // Unexpected errors - show toast and rethrow
      toast.error(e instanceof Error ? e.message : String(e));
      throw e;
    }
  };

  const sendNotification = async (notification: ClientNotification) => {
    if (!mcpClient) {
      const error = new Error("MCP client not connected");
      toast.error(error.message);
      throw error;
    }

    const timestamp = performance.now();
    try {
      await mcpClient.notification(notification);
      // Log successful notifications
      pushHistory(timestamp, notification);
    } catch (e: unknown) {
      if (e instanceof McpError) {
        // Log MCP protocol errors
        pushHistory(timestamp, notification, { error: e.message });
      }
      toast.error(e instanceof Error ? e.message : String(e));
      throw e;
    }
  };

  const checkProxyHealth = async () => {
    try {
      const proxyHealthUrl = new URL(`${props.proxy}/api/health`);
      const proxyHealthResponse = await fetch(proxyHealthUrl);
      const proxyHealth = await proxyHealthResponse.json<{ status: string }>();
      if (proxyHealth?.status !== "ok") {
        throw new Error("MCP Proxy Server is not healthy");
      }
    } catch (e) {
      console.error("Couldn't connect to MCP Proxy Server", e);
      throw e;
    }
  };

  const handleAuthError = async (error: unknown) => {
    if (error instanceof SseError && error.code === 401) {
      const sseUrl = props.type !== Transport.STDIO ? props.url : null;

      if (!sseUrl) {
        throw new Error("No SSE URL provided for authentication");
      }

      // Create a new auth provider with the current server URL
      const serverAuthProvider = new InspectorOAuthClientProvider(sseUrl);

      const result = await auth(serverAuthProvider, { serverUrl: sseUrl });
      return result === "AUTHORIZED";
    }

    return false;
  };

  const connect = async (_e?: unknown, retryCount = 0) => {
    setConnectionStatus(ConnectionStatus.CONNECTING);
    const client = new Client<Request, Notification, Result>(
      {
        name: "muppet-inspector",
        version: "0.1.0",
      },
      {
        capabilities: {
          sampling: {},
          roots: {
            listChanged: true,
          },
        },
      },
    );

    try {
      await checkProxyHealth();
    } catch {
      setConnectionStatus(ConnectionStatus.ERROR_CONNECTING_TO_PROXY);
      return;
    }
    let mcpProxyServerUrl: URL;
    switch (props.type) {
      case Transport.STDIO:
        mcpProxyServerUrl = new URL(`${props.proxy}/api/stdio`);
        mcpProxyServerUrl.searchParams.append("command", props.command);

        if (props.args)
          mcpProxyServerUrl.searchParams.append("args", props.args);

        if (props.env)
          mcpProxyServerUrl.searchParams.append(
            "env",
            JSON.stringify(props.env),
          );
        break;

      case Transport.SSE:
        mcpProxyServerUrl = new URL(`${props.proxy}/api/sse`);
        mcpProxyServerUrl.searchParams.append("url", props.url);
        break;

      case Transport.HTTP:
        mcpProxyServerUrl = new URL(`${props.proxy}/api/mcp`);
        mcpProxyServerUrl.searchParams.append("url", props.url);
        break;
    }

    mcpProxyServerUrl.searchParams.append("type", props.type);

    try {
      // Inject auth manually instead of using SSEClientTransport, because we're
      // proxying through the inspector server first.
      const headers: HeadersInit = {};

      if (props.type !== Transport.STDIO) {
        // Create an auth provider with the current server URL
        const serverAuthProvider = new InspectorOAuthClientProvider(props.url);

        // Use manually provided bearer token if available, otherwise use OAuth tokens
        const token =
          props.bearerToken ||
          (await serverAuthProvider.tokens())?.access_token;
        if (token) {
          const authHeaderName = props.headerName || "Authorization";
          headers[authHeaderName] = `Bearer ${token}`;
          setToken(token);
        }
      }

      // Create appropriate transport
      const transportOptions = {
        eventSourceInit: {
          fetch: (
            url: string | URL | globalThis.Request,
            init: RequestInit | undefined,
          ) => fetch(url, { ...init, headers }),
        },
        requestInit: {
          headers,
        },
      };

      // Set the connection link for tunneling
      setConnectionLink({
        url: mcpProxyServerUrl,
        headers,
      });

      if (props.onNotification) {
        for (const notificationSchema of [
          CancelledNotificationSchema,
          LoggingMessageNotificationSchema,
          ResourceUpdatedNotificationSchema,
          ResourceListChangedNotificationSchema,
          ToolListChangedNotificationSchema,
          PromptListChangedNotificationSchema,
        ]) {
          client.setNotificationHandler(
            notificationSchema,
            props.onNotification,
          );
        }

        client.fallbackNotificationHandler = (notification): Promise<void> => {
          props.onNotification?.(notification);
          return Promise.resolve();
        };
      }

      if (props.onStdErrNotification) {
        client.setNotificationHandler(
          StdErrNotificationSchema,
          props.onStdErrNotification,
        );
      }

      let capabilities: ServerCapabilities | undefined;
      const timestamp = performance.now();
      try {
        const clientTransport =
          props.type === Transport.HTTP
            ? new StreamableHTTPClientTransport(mcpProxyServerUrl, {
                sessionId: undefined,
                ...transportOptions,
              })
            : new SSEClientTransport(mcpProxyServerUrl, transportOptions);

        await client.connect(clientTransport);

        setClientTransport(clientTransport);

        capabilities = client.getServerCapabilities();
        const initializeRequest = {
          method: "initialize",
        };
        pushHistory(timestamp, initializeRequest, {
          capabilities,
          serverInfo: client.getServerVersion(),
          instructions: client.getInstructions(),
        });
      } catch (error) {
        console.error(
          `Failed to connect to MCP Server via the MCP Inspector Proxy: ${mcpProxyServerUrl}:`,
          error,
        );
        const shouldRetry = await handleAuthError(error);
        if (shouldRetry) {
          return connect(undefined, retryCount + 1);
        }

        if (error instanceof SseError && error.code === 401) {
          // Don't set error state if we're about to redirect for auth
          return;
        }
        throw error;
      }
      setServerCapabilities(capabilities ?? null);
      setCompletionsSupported("completions" in (capabilities ?? {}));

      const onPendingRequest = props.onPendingRequest;
      if (onPendingRequest) {
        client.setRequestHandler(CreateMessageRequestSchema, (request) => {
          return new Promise((resolve, reject) => {
            onPendingRequest(request, resolve, reject);
          });
        });
      }

      const getRoots = props.getRoots;
      if (getRoots) {
        client.setRequestHandler(ListRootsRequestSchema, async () => {
          return { roots: getRoots() };
        });
      }

      setMcpClient(client);
      setConnectionStatus(ConnectionStatus.CONNECTED);
    } catch (e) {
      console.error(e);
      setConnectionStatus(ConnectionStatus.ERROR);
    }
  };

  const disconnect = async () => {
    if (
      props.type === Transport.HTTP &&
      clientTransport &&
      "terminateSession" in clientTransport
    ) {
      await clientTransport.terminateSession();
    }

    await mcpClient?.close();

    if (props.type !== Transport.STDIO) {
      const authProvider = new InspectorOAuthClientProvider(props.url);
      authProvider.clear();
    }

    setMcpClient(null);
    setClientTransport(null);
    setConnectionStatus(ConnectionStatus.DISCONNECTED);
    setCompletionsSupported(false);
    setServerCapabilities(null);
  };

  return {
    connectionStatus,
    serverCapabilities,
    token,
    mcpClient,
    requestHistory,
    makeRequest,
    sendNotification,
    handleCompletion,
    completionsSupported,
    setRequestHistory,
    connect,
    disconnect,
  };
}
