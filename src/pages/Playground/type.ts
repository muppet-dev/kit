import type { AssistantRuntime } from "@assistant-ui/react";
import type { SupportedModels } from "./supportedModels";

export type ModelProps = {
  id: string;
  model: SupportedModels;
  // Internal
  sync?: boolean;
  activePrompt?: string;
  runtime?: AssistantRuntime;
} & Record<string, unknown>;
