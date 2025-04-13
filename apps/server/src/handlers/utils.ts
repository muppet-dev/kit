import { getContext } from "hono/context-storage";
import type { InspectorEnv } from "../types";

export function runner(prompt: string) {
  const c = getContext<InspectorEnv>();

  // @ts-expect-error
  const { model } = c.req.valid("json") as { model: keyof AiModels };

  return c.env.AI.run(
    model,
    {
      prompt,
      response_format: {
        type: "json_schema",
        json_schema: {
          type: "object",
          properties: {
            score: {
              type: "number",
              description: "The score of the tool, between 0 and 10.",
            },
            findings: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  category: {
                    type: "string",
                    description: "The category of the finding.",
                  },
                  description: {
                    type: "string",
                    description: "A description of the finding.",
                  },
                  severity: {
                    type: "string",
                    description: "The severity of the finding.",
                    enum: ["low", "medium", "high"],
                  },
                  evidence: {
                    type: "string",
                    description: "Evidence supporting the finding.",
                  },
                },
                required: ["category", "description", "severity"],
              },
              description: "A list of findings from the tool.",
            },
          },
        },
      },
    },
    {
      gateway: {
        id: "mcp-mavens",
        skipCache: false,
        cacheTtl: 3360,
      },
    },
  );
}
