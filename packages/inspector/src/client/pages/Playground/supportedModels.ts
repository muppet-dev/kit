import { OpenAIIcon } from "@/client/components/icons/OpenAI";

export type SupportedModels = "openai:gpt-4.1" | "openai:gpt-4.1-mini";

export const PROPERTIES_CONFIG = {
  maxTokens: {
    label: "Max Output Tokens",
    description: "The maximum number of tokens to return",
  },
  temperature: {
    label: "Temperature",
    description:
      "Controls the randomness of the returned text; lower is less random",
  },
  topP: {
    label: "Top P",
    description:
      "The cumulative probability of the most likely tokens to return",
  },
};

export type ModelConfig = {
  provider: keyof typeof PROVIDER_ICONS;
  name: string;
  description: string;
  metadata: {
    context: number;
    input_pricing: number;
    output_pricing: number;
    links: {
      model: string;
      pricing: string;
      website: string;
    };
  };
  properties: Record<
    keyof typeof PROPERTIES_CONFIG,
    | {
        default: number;
        min: number;
        max: number;
      }
    | undefined
  >;
};

export const PROVIDER_ICONS = {
  OpenAI: OpenAIIcon,
};

export const MODELS_CONFIG: Record<SupportedModels, ModelConfig> = {
  "openai:gpt-4.1": {
    provider: "OpenAI",
    name: "GPT-4.1",
    description:
      "GPT 4.1 is OpenAI's flagship model for complex tasks. It is well suited for problem solving across domains.",
    metadata: {
      context: 1047572,
      input_pricing: 2,
      output_pricing: 8,
      links: {
        model: "https://platform.openai.com/docs/models/gpt-4.1",
        pricing: "https://platform.openai.com/docs/pricing",
        website: "https://openai.com/",
      },
    },
    properties: {
      maxTokens: {
        default: 8192,
        min: 50,
        max: 16384,
      },
      temperature: {
        default: 0.7,
        min: 0,
        max: 2,
      },
      topP: {
        default: 1,
        min: 0,
        max: 1,
      },
    },
  },
  "openai:gpt-4.1-mini": {
    provider: "OpenAI",
    name: "GPT-4.1 mini",
    description:
      "GPT 4.1 mini provides a balance between intelligence, speed, and cost that makes it an attractive model for many use cases.",
    metadata: {
      context: 1047576,
      input_pricing: 0.4,
      output_pricing: 1.6,
      links: {
        model: "https://platform.openai.com/docs/models/gpt-4.1-mini",
        pricing: "https://platform.openai.com/docs/pricing",
        website: "https://openai.com/",
      },
    },
    properties: {
      maxTokens: {
        default: 8192,
        min: 50,
        max: 16384,
      },
      temperature: {
        default: 0.7,
        min: 0,
        max: 2,
      },
      topP: {
        default: 1,
        min: 0,
        max: 1,
      },
    },
  },
};
