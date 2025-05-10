import type { InspectorConfig } from "@muppet-kit/shared";

export type EnvWithConfig = {
  Variables: {
    config: InspectorConfig;
  };
};
