import { OpenAIIcon } from "@/client/components/icons/OpenAI";

export type SupportedModels = "openai:gpt-4.1" | "openai:gpt-4.1-mini";

export type ModelConfig = {
  provider: keyof typeof PROVIDER_ICONS;
  name: string;
};

export const PROVIDER_ICONS = {
  OpenAI: OpenAIIcon,
};

export const MODELS_CONFIG: Record<SupportedModels, ModelConfig> = {
  "openai:gpt-4.1": {
    provider: "OpenAI",
    name: "GPT-4.1",
  },
  "openai:gpt-4.1-mini": {
    provider: "OpenAI",
    name: "GPT-4.1 mini",
  },
};
