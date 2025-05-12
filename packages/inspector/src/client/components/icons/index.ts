import { AmazonIcon } from "./Amazon";
import { AnthropicIcon } from "./Anthropic";
import { CerebrasIcon } from "./Cerebras";
import { CohereIcon } from "./Cohere";
import { DeepInfraIcon } from "./DeepInfra";
import { DeepSeekIcon } from "./DeepSeek";
import { FireworksIcon } from "./Fireworks";
import { GoogleIcon } from "./Google";
import { GroqIconIcon } from "./Groq";
import { InceptionIcon } from "./Inception";
import { MistralIcon } from "./Mistral";
import { OpenAIIcon } from "./OpenAI";
import { PerplexityIcon } from "./Perplexity";
import { xAIIcon } from "./xAI";

export const PROVIDER_ICONS: Record<string, typeof OpenAIIcon> = {
  openai: OpenAIIcon,
  anthropic: AnthropicIcon,
  cerebras: CerebrasIcon,
  cohere: CohereIcon,
  deepInfra: DeepInfraIcon,
  deepseek: DeepSeekIcon,
  fireworks: FireworksIcon,
  google: GoogleIcon,
  groq: GroqIconIcon,
  inception: InceptionIcon,
  mistral: MistralIcon,
  amazon: AmazonIcon,
  perplexity: PerplexityIcon,
  xai: xAIIcon,
};
