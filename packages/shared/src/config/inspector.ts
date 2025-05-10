import type { LanguageModelV1 } from "ai";
import type { InspectorConfig, SanitizedInspectorConfig } from "../types";

export function defineInspectorConfig(
  config: Partial<InspectorConfig>,
): SanitizedInspectorConfig {
  const {
    host = process.env.HOST ?? "localhost",
    port = Number(process.env.PORT ?? 3553),
    models,
    ..._config
  } = config;

  let defaultModel: LanguageModelV1 | undefined;
  const availableModels: Record<string, LanguageModelV1> = {};

  if (models) {
    for (const model of models) {
      if ("modelId" in model) {
        availableModels[`${model.provider}:${model.modelId}`] = model;
      } else {
        availableModels[`${model.model.provider}:${model.model.modelId}`] =
          model.model;

        if (model.default) {
          defaultModel = model.model;
        }
      }
    }
  }

  if (!defaultModel && models) {
    defaultModel = availableModels[Object.keys(availableModels)[0]];
  }

  return {
    host,
    port,
    models: models
      ? {
          default: defaultModel!,
          available: availableModels,
        }
      : undefined,
    ..._config,
  };
}
