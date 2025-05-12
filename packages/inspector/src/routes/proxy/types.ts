import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import type { Broadcast } from "./broadcast";

export type ProxyEnv = {
  Variables: {
    transports: Map<string, Transport>;
    backing?: Transport;
    broadcast: Broadcast;
  };
};
