export type InspectorConfig = {
  port: number;
  host: string;
  server: {
    port: number;
    host: string;
  };
};

export function defineInspectorConfig(config: InspectorConfig) {
  return config;
}
