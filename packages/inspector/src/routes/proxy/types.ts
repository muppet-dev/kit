import type { EnvWithConfig } from "@/types";
import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import type { Broadcast } from "./broadcast";

export type ProxyEnv = {
  Variables: EnvWithConfig["Variables"] & {
    webAppTransports: Map<string, Transport>;
    serverTransports: Map<string, Transport>;
    broadcast: Broadcast;
  };
};
