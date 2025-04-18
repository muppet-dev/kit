import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import {
  SSEClientTransport,
  SseError,
} from "@modelcontextprotocol/sdk/client/sse.js";
import {
  type ClientNotification,
  type ClientRequest,
  CreateMessageRequestSchema,
  ListRootsRequestSchema,
  ProgressNotificationSchema,
  ResourceUpdatedNotificationSchema,
  LoggingMessageNotificationSchema,
  type Request,
  type Result,
  type ServerCapabilities,
  type PromptReference,
  type ResourceReference,
  McpError,
  CompleteResultSchema,
  ErrorCode,
} from "@modelcontextprotocol/sdk/types.js";
import { useState } from "react";
import type z from "zod";
import { type Notification, StdErrNotificationSchema } from "@/types";
import packageJson from "../../package.json";
import toast from "react-hot-toast";
import type { TransportType } from "@/constants";

const params = new URLSearchParams(window.location.search);
const DEFAULT_REQUEST_TIMEOUT_MSEC =
  Number.parseInt(params.get("timeout") ?? "") || 10000;

interface UseConnectionOptions {
  transportType: TransportType;
  command: string;
  args: string;
  sseUrl: string;
  env: Record<string, string>;
  proxyServerUrl: string;
  bearerToken?: string;
  requestTimeout?: number;
  onNotification?: (notification: Notification) => void;
  onStdErrNotification?: (notification: Notification) => void;
  onPendingRequest?: (request: any, resolve: any, reject: any) => void;
  getRoots?: () => any[];
}

interface RequestOptions {
  signal?: AbortSignal;
  timeout?: number;
  suppressToast?: boolean;
}

export function useConnection({
  transportType,
  command,
  args,
  sseUrl,
  env,
  proxyServerUrl,
  bearerToken,
  requestTimeout = DEFAULT_REQUEST_TIMEOUT_MSEC,
  onNotification,
  onStdErrNotification,
  onPendingRequest,
  getRoots,
}: UseConnectionOptions) {
  const [connectionStatus, setConnectionStatus] = useState<
    "disconnected" | "connected" | "error"
  >("disconnected");
  const [serverCapabilities, setServerCapabilities] =
    useState<ServerCapabilities | null>(null);
  const [mcpClient, setMcpClient] = useState<Client | null>(null);
  const [requestHistory, setRequestHistory] = useState<
    { request: string; response?: string }[]
  >([]);
  const [completionsSupported, setCompletionsSupported] = useState(true);

  const pushHistory = (request: object, response?: object) => {
    setRequestHistory((prev) => [
      ...prev,
      {
        request: JSON.stringify(request),
        response: response !== undefined ? JSON.stringify(response) : undefined,
      },
    ]);
  };

  const makeRequest = async <T extends z.ZodType>(
    request: ClientRequest,
    schema: T,
    options?: RequestOptions,
  ): Promise<z.output<T>> => {
    if (!mcpClient) {
      throw new Error("MCP client not connected");
    }

    try {
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => {
        abortController.abort("Request timed out");
      }, options?.timeout ?? requestTimeout);

      let response: z.output<T>;
      try {
        response = await mcpClient.request(request, schema, {
          signal: options?.signal ?? abortController.signal,
        });
        pushHistory(request, response);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        pushHistory(request, { error: errorMessage });
        throw error;
      } finally {
        clearTimeout(timeoutId);
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

    try {
      await mcpClient.notification(notification);
      // Log successful notifications
      pushHistory(notification);
    } catch (e: unknown) {
      if (e instanceof McpError) {
        // Log MCP protocol errors
        pushHistory(notification, { error: e.message });
      }
      toast.error(e instanceof Error ? e.message : String(e));
      throw e;
    }
  };

  const connect = async () => {
    try {
      const client = new Client<Request, Notification, Result>(
        {
          name: "mcp-inspector",
          version: packageJson.version,
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

      const backendUrl = new URL(`${proxyServerUrl}/sse`);

      backendUrl.searchParams.append("transportType", transportType);
      if (transportType === "stdio") {
        backendUrl.searchParams.append("command", command);
        backendUrl.searchParams.append("args", args);
        backendUrl.searchParams.append("env", JSON.stringify(env));
      } else {
        backendUrl.searchParams.append("url", sseUrl);
      }

      // Inject auth manually instead of using SSEClientTransport, because we're
      // proxying through the inspector server first.
      const headers: HeadersInit = {};

      // Use manually provided bearer token if available, otherwise use OAuth tokens
      const token = bearerToken;
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const clientTransport = new SSEClientTransport(backendUrl, {
        eventSourceInit: {
          fetch: (url, init) => fetch(url, { ...init, headers }),
        },
        requestInit: {
          headers,
        },
      });

      if (onNotification) {
        client.setNotificationHandler(
          ProgressNotificationSchema,
          onNotification,
        );

        client.setNotificationHandler(
          ResourceUpdatedNotificationSchema,
          onNotification,
        );

        client.setNotificationHandler(
          LoggingMessageNotificationSchema,
          onNotification,
        );
      }

      if (onStdErrNotification) {
        client.setNotificationHandler(
          StdErrNotificationSchema,
          onStdErrNotification,
        );
      }

      try {
        await client.connect(clientTransport);
      } catch (error) {
        console.error("Failed to connect to MCP server:", error);

        if (error instanceof SseError && error.code === 401) {
          // Don't set error state if we're about to redirect for auth
          return;
        }
        throw error;
      }

      const capabilities = client.getServerCapabilities();
      setServerCapabilities(capabilities ?? null);
      setCompletionsSupported(true); // Reset completions support on new connection

      if (onPendingRequest) {
        client.setRequestHandler(CreateMessageRequestSchema, (request) => {
          return new Promise((resolve, reject) => {
            onPendingRequest(request, resolve, reject);
          });
        });
      }

      if (getRoots) {
        client.setRequestHandler(ListRootsRequestSchema, async () => {
          return { roots: getRoots() };
        });
      }

      setMcpClient(client);
      setConnectionStatus("connected");
    } catch (e) {
      console.error(e);
      setConnectionStatus("error");
    }
  };

  return {
    connectionStatus,
    serverCapabilities,
    mcpClient,
    requestHistory,
    makeRequest,
    sendNotification,
    handleCompletion,
    completionsSupported,
    connect,
  };
}
