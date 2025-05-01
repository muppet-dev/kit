import type { LLMModel } from "@/constants";

export type ModelProps = {
  model?: LLMModel;
  prompt?: string;
  maxTokens: number;
  temperature: number;
  topP: number;
};
