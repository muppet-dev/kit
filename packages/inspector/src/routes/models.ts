import type { EnvWithDefaultModel } from "@/types/index.js";
import { sValidator } from "@hono/standard-validator";
import { transportSchema } from "@muppet-kit/shared";
import { generateObject, streamText, experimental_createMCPClient } from "ai";
import { Experimental_StdioMCPTransport } from "ai/mcp-stdio";
import { Hono } from "hono";
import { createFactory } from "hono/factory";
import { stream } from "hono/streaming";
import z from "zod";

const router = new Hono<EnvWithDefaultModel>();

const factory = createFactory<EnvWithDefaultModel>();

const handlers = factory.createHandlers(
  async (c, next) => {
    const { models } = c.get("config");

    if (!models) {
      return c.json({
        error: "LLM models are not configured",
      });
    }

    c.set("models", models);

    await next();
  },
  sValidator(
    "query",
    z.object({
      modelId: z.string().min(1).optional(),
    }),
  ),
  async (c, next) => {
    const { modelId } = c.req.valid("query");

    const modelsConfig = c.get("models");

    const model = modelId
      ? modelsConfig.available[modelId]
      : modelsConfig.default;

    c.set("modelToBeUsed", model);

    await next();
  },
);

router.post(
  "/chat",
  ...handlers,
  sValidator("query", transportSchema),
  sValidator(
    "json",
    z.object({
      messages: z.array(z.any()),
    }),
  ),
  async (c) => {
    const transport = c.req.valid("query");
    const { messages } = c.req.valid("json");

    let tools = {};

    try {
      let _transport: any = transport;
      if (_transport.type === "stdio") {
        _transport = new Experimental_StdioMCPTransport({
          command: _transport.command,
          args: _transport.args,
          env: _transport.env,
        });
      }

      const mcpClient = await experimental_createMCPClient({
        transport: _transport,
      });

      tools = await mcpClient.tools();
    } catch (error) {
      console.log("Unable to create MCP client transport", error);
    }

    const result = streamText({
      model: c.get("modelToBeUsed"),
      tools,
      messages,
    });

    c.header("Content-Type", "text/plain; charset=utf-8");

    return stream(c, (stream) => stream.pipe(result.toDataStream()));
  },
);

router.post(
  "/generate",
  ...handlers,
  sValidator(
    "json",
    z.object({
      name: z.string(),
      description: z.string().optional(),
      schema: z.record(z.string(), z.any()),
      context: z.string().optional(),
    }),
  ),
  async (c) => {
    const { name, description, schema, context } = c.req.valid("json");

    let prompt = `Generate sample data for the tool "${name}"${
      description ? ` with the description "${description}"` : ""
    }. The input schema is ${JSON.stringify(
      schema,
    )}. The sample data should be a JSON object that matches the input schema. This is a MCP (Model Context Protocol) tool.`;

    if (context) {
      prompt += ` The context is "${context}". The sample data should be relevant to the context.`;
    }

    const result = await generateObject({
      model: c.get("modelToBeUsed"),
      prompt,
      schemaName: name,
      schemaDescription: description,
      schema: convertJsonSchemaToZod(schema),
    });

    c.header("Content-Type", "text/plain; charset=utf-8");

    return c.json(result.object);
  },
);

router.post(
  "/analyse",
  ...handlers,
  sValidator(
    "json",
    z.object({
      name: z.string(),
      description: z.string().optional(),
      schema: z.record(z.string(), z.any()),
      context: z.string().optional(),
    }),
  ),
  async (c) => {
    const { name, description, schema, context } = c.req.valid("json");

    let prompt = `Generate a score and recommendations for the MCP (Model Context Protocol) tool "${name}"${
      description ? ` with the description "${description}"` : ""
    }. The input schema is ${JSON.stringify(
      schema,
    )}. The score should be between 0 and 10, with 10 being the best. The recommendations should include a category, description, and severity (low, medium, high). The output should be a JSON object that includes the score and an array of recommendations. The recommendations should be actionable and specific to the tool's description and schema.`;

    if (context) {
      prompt += ` The context is "${context}". The sample data should be relevant to the context.`;
    }

    const result = await generateObject({
      model: c.get("modelToBeUsed"),
      prompt,
      schemaName: "mcp-tool-scoring",
      schemaDescription:
        "This is used to score the MCP (Model Context Protocol) tools, prompts, and resources.",
      schema: z.object({
        score: z
          .number()
          .min(0)
          .max(10)
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
