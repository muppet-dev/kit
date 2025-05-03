import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";

export type ProxyEnv = {
  Variables: {
    transports: Map<string, Transport>;
    backing?: Transport;
  };
};
