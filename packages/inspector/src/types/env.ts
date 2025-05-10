import type { SanitizedInspectorConfig } from "@muppet-kit/shared";
import type { LanguageModel } from "ai";

export type EnvWithConfig = {
  Variables: {
    config: SanitizedInspectorConfig;
  };
};

export type EnvWithModels = {
  Variables: EnvWithConfig["Variables"] & {
    models: NonNullable<SanitizedInspectorConfig["models"]>;
  };
};

export type EnvWithDefaultModel = {
  Variables: EnvWithConfig["Variables"] & {
    models: NonNullable<SanitizedInspectorConfig["models"]>;
    defaultModel: LanguageModel;
  };
};
