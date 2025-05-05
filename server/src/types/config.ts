export type InspectorConfig = {
  host: string;
  port: number;
  plugins: {
    tunnel?: {
      enabled?: boolean;
      ngrokAPIKey?: string;
    };
    playground?: {
      enabled?: boolean;
      providers?: {
        anthropic?:
          | boolean
          | string
          | {
              apiKey?: string;
            };
        openai?:
          | boolean
          | string
          | {
              apiKey?: string;
            };
      };
    };
    score?: {
      enabled?: boolean;
      provider: "openai" | "anthropic";
      model: string;
      apiKey?: string;
    };
  };
};
