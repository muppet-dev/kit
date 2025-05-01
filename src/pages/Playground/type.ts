import type { ThreadComposerRuntime } from "@assistant-ui/react";
import type { SupportedModels } from "./supportedModels";

export type ModelProps = {
  id: string;
  model: SupportedModels;
  // Internal
  sync?: boolean;
  activePrompt?: string;
  composer?: ThreadComposerRuntime;
} & Record<string, unknown>;
