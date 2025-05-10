import {
  AmazonIcon,
  AnthropicIcon,
  CerebrasIcon,
  CohereIcon,
  DeepInfraIcon,
  DeepSeekIcon,
  FireworksIcon,
  GoogleIcon,
  GroqIconIcon,
  InceptionIcon,
  MistralIcon,
  OpenAIIcon,
  PerplexityIcon,
  xAIIcon,
} from "./icons";

export type SupportedModels = "openai:gpt-4.1" | "openai:gpt-4.1-mini";

export type ModelConfig = {
  provider: keyof typeof PROVIDER_ICONS;
  name: string;
};

export const PROVIDER_ICONS = {
  OpenAI: OpenAIIcon,
  Anthropic: AnthropicIcon,
  Cerebras: CerebrasIcon,
  Cohere: CohereIcon,
  DeepInfra: DeepInfraIcon,
  DeepSeek: DeepSeekIcon,
  Fireworks: FireworksIcon,
  Google: GoogleIcon,
  GroqIcon: GroqIconIcon,
  Inception: InceptionIcon,
  Mistral: MistralIcon,
  Amazon: AmazonIcon,
  Perplexity: PerplexityIcon,
  xAI: xAIIcon,
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
