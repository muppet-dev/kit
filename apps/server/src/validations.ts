import { z } from "zod";

export enum MCPAnalysisType {
  TOOL_INJECTION = "tool_injection",
  PROMPT_INJECTION = "prompt_injection",
}

export const payloadSchema = z.object({
  url: z.string().url(),
  bearer: z.string().optional(),
  analysisType: z.nativeEnum(MCPAnalysisType),
  model: z
    .enum([
      "@cf/meta/llama-3.1-8b-instruct-fast",
      "@cf/meta/llama-3.1-70b-instruct",
      "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
      "@cf/meta/llama-3-8b-instruct",
      "@cf/meta/llama-3.1-8b-instruct",
      "@cf/meta/llama-3.2-11b-vision-instruct",
      "@hf/nousresearch/hermes-2-pro-mistral-7b",
      "@hf/thebloke/deepseek-coder-6.7b-instruct-awq",
      "@cf/deepseek-ai/deepseek-r1-distill-qwen-32b",
    ])
    .default("@cf/deepseek-ai/deepseek-r1-distill-qwen-32b"),
});
