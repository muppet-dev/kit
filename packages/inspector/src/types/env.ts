import type { SanitizedInspectorConfig } from "@muppet-kit/shared";
import type { LanguageModel } from "ai";
import type { Logger } from "pino";

export type EnvWithConfig = {
  Variables: {
    logger: Logger;
    config: SanitizedInspectorConfig;
  };
};

export type EnvWithDefaultModel = {
  Variables: EnvWithConfig["Variables"] & {
    models: NonNullable<SanitizedInspectorConfig["models"]>;
    modelToBeUsed: LanguageModel;
  };
};
