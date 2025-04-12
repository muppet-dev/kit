import type { Client } from "@modelcontextprotocol/sdk/client/index.js";

export type InspectorEnv = {
  Bindings: {
    AI: Ai;
  };
  Variables: {
    client: Client;
  };
};
