import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import type { Broadcast } from "./broadcast";
import type { EnvWithConfig } from "@/types";

export type ProxyEnv = {
  Variables: EnvWithConfig["Variables"] & {
    webAppTransports: Map<string, Transport>;
    serverTransports: Map<string, Transport>;
    broadcast: Broadcast;
  };
};
