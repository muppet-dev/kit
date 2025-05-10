import { openai } from "@ai-sdk/openai";
import { sValidator } from "@hono/standard-validator";
import { generateObject } from "ai";
import { Hono } from "hono";
import { z } from "zod";

const router = new Hono();

router.post(
  "/",
  sValidator(
    "json",
    z.object({
      name: z.string(),
      description: z.string(),
      schema: z.record(z.string(), z.any()),
      context: z.string().optional(),
    }),
  ),
  async (c) => {
    const { name, description, schema, context } = c.req.valid("json");

    let prompt = `Generate a score and recommendations for the MCP (Model Context Protocol) tool "${name}" with the description "${description}". The input schema is ${JSON.stringify(
      schema,
    )}. The score should be between 0 and 10, with 10 being the best. The recommendations should include a category, description, and severity (low, medium, high). The output should be a JSON object that includes the score and an array of recommendations. The recommendations should be actionable and specific to the tool's description and schema.`;

    if (context) {
      prompt += ` The context is "${context}". The sample data should be relevant to the context.`;
    }

    const result = await generateObject({
      model: openai("gpt-4o"),
      prompt,
      schemaName: "mcp-tool-scoring",
      schemaDescription:
        "This is used to score the MCP (Model Context Protocol) tools, prompts, and resources.",
      schema: z.object({
        score: z
          .number()
          .describe("The overall score of the tool, between 0 and 10."),
        recommendations: z.array(
          z.object({
            category: z
              .string()
              .describe("The category of the recommendation."),
            description: z
              .string()
              .describe(
                "The description of the recommendation and how to improve.",
              ),
            severity: z
              .enum(["low", "medium", "high"])
              .describe("The severity of the recommendation."),
          }),
        ),
      }),
    });

    c.header("Content-Type", "text/plain; charset=utf-8");

    console.log(result.object);

    return c.json(result.object);
  },
);

export default router;
