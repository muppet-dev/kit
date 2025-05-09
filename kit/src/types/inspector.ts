import type { LanguageModelV1 } from "ai";

type StdioServerConfig = {
  name?: string;
  transport: "stdio";
  command: string;
  args?: string;
  env?: Array<Record<string, string>>;
};

type HttpServerConfig = {
  name?: string;
  transport: "http" | "sse";
  url: string;
  headerName?: string;
  bearerToken?: string;
};

type TransportConfig = StdioServerConfig | HttpServerConfig;

export type InspectorConfig = {
  /**
   * The port to listen on.
   * @default 3553
   */
  port: number;
  /**
   * The host to listen on.
   * @default 0.0.0.0
   */
  host: string;
  /**
   * The default configuration for connecting to the MCP.
   */
  configurations?: TransportConfig | Array<TransportConfig>;
  /**
   * For connecting your local MCP Server to any MCP Client. This will make the inspector the middleman between the MCP Client and the MCP Server.
   * This is useful for debugging and inspecting the requests and responses between the MCP Client and the MCP Server.
   */
  tunneling?: {
    /**
     * We use the `ngrok` service to tunnel your local MCP Server to the internet. Pass the `ngrok` auth token here to authenticate your account.
     */
    apiKey: string;
  };
  /**
   * List all the models you wanna use in the inspector.
   */
  models?: Array<
    | LanguageModelV1
    | {
        model: LanguageModelV1;
        /**
         * This will mark the model to be used for generating sample data, scoring, and other tasks. If not specified, the first model will be used.
         */
        default?: boolean;
      }
  >;
};
