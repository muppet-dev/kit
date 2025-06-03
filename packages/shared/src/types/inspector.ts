import type { LanguageModel } from "ai";
import type z from "zod";
import type { transportSchema } from "../validations";

type TransportConfig = { name: string } & z.infer<typeof transportSchema>;

export type TunnelHandler = {
  generate: (options: { port: number }) => Promise<{
    url: string | null;
  }>;
};

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
   * Enables the inspector to open automatically when the server starts.
   * @default true
   */
  auto_open?: boolean;
  /**
   * The default configuration for connecting to the MCP.
   */
  configurations?: TransportConfig | Array<TransportConfig>;
  /**
   * For connecting your local MCP Server to any MCP Client. This will make the inspector the middleman between the MCP Client and the MCP Server.
   * This is useful for debugging and inspecting the requests and responses between the MCP Client and the MCP Server.
   */
  tunneling?: TunnelHandler;
  /**
   * List all the models you wanna use in the inspector.
   */
  models?: Array<
    | LanguageModel
    | {
        model: LanguageModel;
        /**
         * This will mark the model to be used for generating sample data, scoring, and other tasks. If not specified, the first model will be used.
         */
        default?: boolean;
      }
  >;
};

export type SanitizedInspectorConfig = Omit<InspectorConfig, "models"> & {
  models?: {
    default: LanguageModel;
    available: Record<string, LanguageModel>;
  };
};
