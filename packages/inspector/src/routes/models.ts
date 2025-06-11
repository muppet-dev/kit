import type { EnvWithDefaultModel } from "@/types/index.js";
import { customThemeSchema } from "@/validations";
import { sValidator } from "@hono/standard-validator";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import { Transport as TransportEnum, transportSchema } from "@muppet-kit/shared";
import { generateObject, streamText, tool } from "ai";
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

let client: Client;

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
    const queryPayload = c.req.valid("query");
    const { messages } = c.req.valid("json");

    let tools = {};

    try {
      if (!client) {
        client = new Client(
          {
            name: "muppet-inspector",
            version: "0.1.0",
          },
          {
            capabilities: {
              sampling: {},
              roots: {
                listChanged: true,
              },
            },
          },
        );

        let transport: Transport; if (queryPayload.type === TransportEnum.STDIO) {
          transport = new StdioClientTransport({
            command: queryPayload.command,
            args: queryPayload.args ? [queryPayload.args] : undefined,
            env: queryPayload.env
              ? queryPayload.env.reduce<Record<string, string>>((acc, { key, value }) => {
                acc[key] = value;
                return acc;
              }
                , {})
              : undefined,
          })
        } else {

          let headers: HeadersInit = {};
          if (queryPayload.headerName && queryPayload.bearerToken) {
            headers = { [queryPayload.headerName]: queryPayload.bearerToken };
          } else if (queryPayload.bearerToken) {
            headers = {
              Authorization: queryPayload.bearerToken,
            };
          }

          if (queryPayload.type === TransportEnum.SSE) {
            transport = new SSEClientTransport(new URL(queryPayload.url), {
              eventSourceInit: {
                fetch: (
                  url: string | URL | globalThis.Request,
                  init: RequestInit | undefined,
                ) => fetch(url, { ...init, headers }),
              },
              requestInit: {
                headers,
              }
            });
          } else if (queryPayload.type === TransportEnum.HTTP) {
            transport = new StreamableHTTPClientTransport(new URL(queryPayload.url), {
              sessionId: undefined,
              requestInit: {
                headers,
              }
            })
          } else {
            throw new Error(
              `Unsupported transport type: ${queryPayload.type}`,
            );
          }
        }

        await client.connect(transport);
      }

      tools = {
        list_tools: tool({
          description: "List all available tools from an MCP server, it will return the name, description, and parameters of each tool.",
          parameters: z.object({}),
          execute: async () => {
            try {
              const result = await client.listTools();
              return {
                success: true,
                tools: result.tools,
                count: result.tools.length
              };
            } catch (error) {
              return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred",
                tools: [],
                count: 0
              };
            }
          }
        }),
        call_tool: tool({
          description: "Execute a specific tool on an MCP server. It will return the result of the tool execution.",
          parameters: z.object({
            name: z.string().describe("Name of the tool to execute"),
            arguments: z.record(z.string(), z.any()).optional().describe("Parameters to pass to the tool"),
          }),
          execute: async (params) => {
            try {
              console.log(params)
              const result = await client.callTool(params);
              return {
                success: true,
                result: result.content,
                isError: result.isError || false
              };
            } catch (error) {
              return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred",
                result: null,
                isError: true
              };
            }
          }
        }),
        list_prompts: tool({
          description: "List all available prompts from an MCP server",
          parameters: z.object({}),
          execute: async () => {
            try {
              const result = await client.listPrompts();
              return {
                success: true,
                prompts: result.prompts,
                count: result.prompts.length
              };
            } catch (error) {
              return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred",
                prompts: [],
                count: 0
              };
            }
          }
        }),
        get_prompt: tool({
          description: "Get a specific prompt from an MCP server",
          parameters: z.object({
            name: z.string().describe("Name of the prompt to retrieve"),
            arguments: z.record(z.any()).optional().describe("Arguments to pass to the prompt")
          }),
          execute: async (params) => {
            try {
              const result = await client.getPrompt(params);
              return {
                success: true,
                description: result.description,
                messages: result.messages
              };
            } catch (error) {
              return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred",
                description: null,
                messages: []
              };
            }
          }
        }),
        list_resources: tool({
          description: "List all available resources from an MCP server",
          parameters: z.object({}),
          execute: async () => {
            try {
              const result = await client.listResources();
              return {
                success: true,
                resources: result.resources,
                count: result.resources.length
              };
            } catch (error) {
              return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred",
                resources: [],
                count: 0
              };
            }
          }
        }),
        list_resource_templates: tool({
          description: "List all available resource templates from the MCP server",
          parameters: z.object({}),
          execute: async () => {
            try {
              const result = await client.listResourceTemplates();
              return {
                success: true,
                resources: result.resourceTemplates,
                count: result.resourceTemplates.length
              };
            } catch (error) {
              return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred",
                resources: [],
                count: 0
              };
            }
          }
        }),
        read_resource: tool({
          description: "Read a specific resource from an MCP server",
          parameters: z.object({
            uri: z.string().describe("URI of the resource to read")
          }),
          execute: async (params) => {
            try {
              const result = await client.readResource(params);
              return {
                success: true,
                contents: result.contents
              };
            } catch (error) {
              return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred",
                contents: []
              };
            }
          }
        }),
      }

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

    let prompt = `Generate sample data for the tool "${name}"${description ? ` with the description "${description}"` : ""
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

    let prompt = `Generate a score and recommendations for the MCP (Model Context Protocol) tool "${name}"${description ? ` with the description "${description}"` : ""
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

router.post(
  "/theme",
  ...handlers,
  sValidator(
    "json",
    z.object({
      context: z.string().optional(),
    }),
  ),
  async (c) => {
    const { context } = c.req.valid("json");

    let prompt =
      "Generate a theme for the application. The theme should include CSS variables for both light and dark modes. You need to generate the value for each CSS variable in hex format. The theme should be visually appealing and suitable for a modern web application. Try to use a consistent color palette and ensure good contrast between text and background colors. This is a MCP (Model Context Protocol) Inspector which is a devtool used by developers for testing and debugging their MCP servers. The UI is built using shadcn/ui, which is a Tailwind CSS component library. The theme should be compatible with shadcn/ui components.";

    if (context) {
      prompt += ` This is the suggestion given by the user, "${context}". Use these suggestions to generate the theme. The theme should be relevant to the context.`;
    }

    const result = await generateObject({
      model: c.get("modelToBeUsed"),
      prompt,
      schemaName: "theme-generation",
      schemaDescription:
        "This is schema containing the css variables for the theme of the application.",
      schema: customThemeSchema,
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
