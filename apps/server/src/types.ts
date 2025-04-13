import type { Client } from "@modelcontextprotocol/sdk/client/index.js";

export type InspectorEnv = {
  Bindings: {
    AI: Ai;
  };
  Variables: {
    client: Client;
  };
};

export type ToolStruct = {
  name: string;
  description?: string;
  inputSchema: Record<string, unknown>;
};

export type PromptStruct = {
  name: string;
  description?: string;
};
