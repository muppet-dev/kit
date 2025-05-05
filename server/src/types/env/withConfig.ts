import type { InspectorConfig } from "../config.js";

export type EnvWithConfig = {
  Variables: {
    config: InspectorConfig;
  };
};
