import type { InspectorConfig } from "../types";

export function defineInspectorConfig(
  config: Partial<InspectorConfig>,
): InspectorConfig {
  const {
    host = process.env.HOST ?? "0.0.0.0",
    port = Number(process.env.PORT ?? 3553),
    ...others
  } = config;

  return {
    host,
    port,
    ...others,
  };
}
