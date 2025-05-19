import { openai } from "@ai-sdk/openai";
import { defineInspectorConfig } from "@muppet-kit/shared";

export default defineInspectorConfig({
  models: [openai("gpt-4.1-nano")],
});
