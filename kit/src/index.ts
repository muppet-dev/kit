import type { InspectorConfig } from "./types";

export function defineInspectorConfig(
  config: Partial<InspectorConfig>,
): InspectorConfig {
  const { host = "0.0.0.0", port = 3553, ...others } = config;

  return {
    host,
    port,
    ...others,
  };
}
