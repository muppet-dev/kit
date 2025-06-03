/**
 * This file is used in development and when deploying to Cloudflare.
 * You can use it to configure the inspector.
 */
import { createOpenAI } from "@ai-sdk/openai";
import { defineInspectorConfig } from "@muppet-kit/shared";

export default (env: Record<string, string | undefined>) => {
  const openai = createOpenAI({
    apiKey: env.OPENAI_API_KEY,
  });

  return defineInspectorConfig({
    models: [openai("gpt-4.1-nano"), openai("gpt-4.1-mini")],
  });
};
