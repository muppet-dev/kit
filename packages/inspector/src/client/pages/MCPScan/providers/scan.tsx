import { useConnection } from "@/client/providers";
import {
  ListPromptsResultSchema,
  ListResourcesResultSchema,
  ListResourceTemplatesResultSchema,
  ListToolsResultSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { useMutation } from "@tanstack/react-query";
import { type PropsWithChildren, createContext, useContext } from "react";

type MCPScanContextType = ReturnType<typeof useMCPScanManager>;

const MCPScanContext = createContext<MCPScanContextType | null>(null);

export const MCPScanProvider = (props: PropsWithChildren) => {
  const values = useMCPScanManager();

  return (
    <MCPScanContext.Provider value={values}>
      {props.children}
    </MCPScanContext.Provider>
  );
};

type MCPScanPayload = {
  type: "tool" | "resource" | "prompt";
  name: string;
  description?: string;
};

type MCPScanResultPayload = MCPScanPayload & {
  errors?: string[];
};

function transformKey(key: string) {
  // Replace all parentheses with square brackets
  const transformed = key.replaceAll(/\(/g, "[").replaceAll(/\)/g, "]");

  // Create a function that will safely evaluate the string as array access
  const keyFn = new Function(`return ${transformed}[1][0]`);

  // Execute the function
  try {
    return keyFn();
  } catch (error) {
    console.error("Error accessing nested value:", error);
    return undefined;
  }
}

function useMCPScanManager() {
  const { serverCapabilities, makeRequest } = useConnection();

  const mutation = useMutation({
    mutationFn: async () => {
      const entries: MCPScanPayload[] = [];
      const promises = [];

      if (serverCapabilities?.tools) {
        promises.push(
          makeRequest({ method: "tools/list" }, ListToolsResultSchema).then(
            ({ tools }) => {
              entries.push(
                ...tools.map(
                  (tool) =>
                    ({
                      type: "tool",
                      name: tool.name,
                      description: tool.description,
                    }) satisfies MCPScanPayload,
                ),
              );
            },
          ),
        );
      }

      if (serverCapabilities?.prompts) {
        promises.push(
          makeRequest({ method: "prompts/list" }, ListPromptsResultSchema).then(
            ({ prompts }) => {
              entries.push(
                ...prompts.map(
                  (prompt) =>
                    ({
                      type: "prompt",
                      name: prompt.name,
                      description: prompt.description,
                    }) satisfies MCPScanPayload,
                ),
              );
            },
          ),
        );
      }

      if (serverCapabilities?.resources) {
        promises.push(
          makeRequest(
            { method: "resources/list" },
            ListResourcesResultSchema,
          ).then(({ resources }) => {
            entries.push(
              ...resources.map(
                (resource) =>
                  ({
                    type: "resource",
                    name: resource.name,
                    description: resource.description,
                  }) satisfies MCPScanPayload,
              ),
            );
          }),
          makeRequest(
            {
              method: "resources/templates/list",
            },
            ListResourceTemplatesResultSchema,
          ).then(({ resourceTemplates }) =>
            entries.push(
              ...resourceTemplates.map(
                (resource) =>
                  ({
                    type: "resource",
                    name: resource.name,
                    description: resource.description,
                  }) satisfies MCPScanPayload,
              ),
            ),
          ),
        );
      }

      await Promise.all(promises);

      const messages = entries.map((entry) => ({
        role: "system",
        content: `${capitalizeFirstLetter(entry.type)} Name:${entry.name}\n${capitalizeFirstLetter(entry.type)} Description:${entry.description}`,
      }));

      const response = await fetch(
        "https://mcp.invariantlabs.ai/api/v1/public/mcp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messages }),
        },
      );

      if (!response.ok) {
        throw new Error(
          `Verification API error: ${response.status} - ${await response.text()}`,
        );
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(`Verification API error: ${data.error_message}`);
      }

      const newEntries: MCPScanResultPayload[] = [];

      for (const error of data.errors ?? []) {
        const index = transformKey(error.key);

        if (index !== undefined) {
          newEntries.push({
            ...entries[index],
            errors: error.error_message,
          });
        }
      }
    },
  });

  return mutation;
}

export const useMCPScan = () => {
  const context = useContext(MCPScanContext);

  if (!context) throw new Error("Missing ModelContext.Provider in the tree!");

  return context;
};

function capitalizeFirstLetter(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
