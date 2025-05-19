import { tool } from "ai";
import z from "zod";

export function createMCPTools(mcpClient: any) {
  return {
    "tools/list": tool({
      description:
        "List all available tools on the MCP server. Use this to discover what tools are available for use.",
      parameters: z.object({}),
      execute: async () => {
        const result = await mcpClient.request({
          request: { method: "tools/list" },
          resultSchema: z.any(),
        });

        return result;
      },
    }),

    "tools/call": tool({
      description:
        "Call a specific tool on the MCP server with the given arguments. Use this to execute a tool function.",
      parameters: z.object({
        name: z.string().describe("The name of the tool to call"),
        arguments: z
          .record(z.any())
          .describe("The arguments to pass to the tool"),
      }),
      execute: async ({ name, arguments: args }) => {
        const result = await mcpClient.request({
          request: { method: "tools/call", params: { name, arguments: args } },
          resultSchema: z.any(),
        });

        return result;
      },
    }),

    "prompts/list": tool({
      description:
        "List all available prompts on the MCP server. Use this to discover what pre-defined prompts are available.",
      parameters: z.object({}),
      execute: async () => {
        const result = await mcpClient.request({
          request: { method: "prompts/list" },
          resultSchema: z.any(),
        });

        return result;
      },
    }),

    "prompts/get": tool({
      description:
        "Get details of a specific prompt from the MCP server. Use this to retrieve the content and metadata of a prompt.",
      parameters: z.object({
        name: z.string().describe("The name of the prompt to retrieve"),
      }),
      execute: async ({ name }) => {
        const result = await mcpClient.request({
          request: { method: "prompts/get", params: { name } },
          resultSchema: z.any(),
        });

        return result;
      },
    }),

    "resources/list": tool({
      description:
        "List all available resources on the MCP server. Resources can be documents, images, or other data that can be used in prompts.",
      parameters: z.object({}),
      execute: async () => {
        const result = await mcpClient.request({
          request: { method: "resources/list" },
          resultSchema: z.any(),
        });

        return result;
      },
    }),

    "resources/read": tool({
      description:
        "Read the content of a specific resource from the MCP server. Use this to retrieve the content of a document, image, or other data stored as a resource.",
      parameters: z.object({
        name: z.string().describe("The name of the resource to read"),
      }),
      execute: async ({ name }) => {
        const result = await mcpClient.request({
          request: { method: "resources/read", params: { name } },
          resultSchema: z.any(),
        });

        return result;
      },
    }),

    "resources/templates/list": tool({
      description:
        "List all available resource templates on the MCP server. Templates define the structure and metadata for creating new resources.",
      parameters: z.object({}),
      execute: async () => {
        const result = await mcpClient.request({
          request: { method: "resources/templates/list" },
          resultSchema: z.any(),
        });

        return result;
      },
    }),

    ping: tool({
      description:
        "Check if the MCP server is available and responsive. Use this to verify connectivity.",
      parameters: z.object({}),
      execute: async () => {
        const result = await mcpClient.request({
          request: { method: "ping" },
          resultSchema: z.any(),
        });

        return result;
      },
    }),
  };
}
