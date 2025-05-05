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
      inputSchema: z.record(z.string(), z.any()),
    }),
  ),
  async (c) => {
    const { name, description, inputSchema } = c.req.valid("json");

    const prompt = `Generate sample data for the tool "${name}" with the description "${description}". The input schema is ${JSON.stringify(
      inputSchema,
    )}. The sample data should be a JSON object that matches the input schema. This is a MCP (Model Context Protocol) tool.`;

    const result = await generateObject({
      model: openai("gpt-4o"),
      prompt,
      schemaName: name,
      schemaDescription: description,
      schema: convertJsonSchemaToZod(inputSchema),
    });

    c.header("Content-Type", "text/plain; charset=utf-8");

    return c.json(result.object);
  },
);

export default router;

// This function converts json schema into a zod schema
function convertJsonSchemaToZod(schema: Record<string, any>) {
  const zodSchema: Record<string, any> = {};

  for (const key in schema) {
    const value = schema[key];

    if (value.type === "string") {
      zodSchema[key] = z.string();
    } else if (value.type === "number") {
      zodSchema[key] = z.number();
    } else if (value.type === "boolean") {
      zodSchema[key] = z.boolean();
    } else if (value.type === "array") {
      zodSchema[key] = z.array(convertJsonSchemaToZod(value.items));
    } else if (value.type === "object") {
      zodSchema[key] = convertJsonSchemaToZod(value.properties);
    }
  }

  return z.object(zodSchema);
}
