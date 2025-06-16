import type { LanguageModel } from "ai";
import type { InspectorConfig, SanitizedInspectorConfig } from "../types";

export function defineInspectorConfig(
  config: Partial<InspectorConfig>,
): SanitizedInspectorConfig {
  const {
    host = process.env.HOST ?? "localhost",
    port = Number(process.env.PORT ?? 3553),
    auto_open = true,
    enableTelemetry = true,
    models,
    ..._config
  } = config;

  let defaultModel: LanguageModel | undefined;
  const availableModels: Record<string, LanguageModel> = {};

  if (models) {
    for (const entry of models) {
      if ("modelId" in entry) {
        availableModels[_generateModelKey(entry)] = entry;
      } else {
        availableModels[_generateModelKey(entry.model)] = entry.model;

        if (entry.default) {
          defaultModel = entry.model;
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
    auto_open,
    enableTelemetry,
    models: models
      ? {
        default: defaultModel!,
        available: availableModels,
      }
      : undefined,
    ..._config,
  };
}

export function _generateModelKey(model: LanguageModel) {
  return `${model.provider.split(".")[0]}:${model.modelId}`;
}
