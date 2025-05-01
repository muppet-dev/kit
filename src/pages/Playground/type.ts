import type { SupportedModels } from "./supportedModels";

export type ModelProps = {
  model?: SupportedModels;
  prompt?: string;
  maxTokens: number;
  temperature: number;
  topP: number;
};
