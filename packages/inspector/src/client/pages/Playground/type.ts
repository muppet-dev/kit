import type { ThreadComposerRuntime } from "@assistant-ui/react";

export type ModelProps = {
  id: string;
  model: string;
  // Internal
  sync?: boolean;
  activePrompt?: string;
  composer?: ThreadComposerRuntime;
} & Record<string, unknown>;
