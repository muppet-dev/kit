import { z } from "zod";

export enum MCPAnalysisType {
  TOOL_INJECTION = "tool_injection",
  PROMPT_INJECTION = "prompt_injection",
}

export const payloadSchema = z.object({
  url: z.string().url(),
  bearer: z.string().optional(),
  analysisType: z.nativeEnum(MCPAnalysisType),
});
