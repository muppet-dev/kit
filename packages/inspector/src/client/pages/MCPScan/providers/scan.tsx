import {
  ListPromptsResultSchema,
  ListResourceTemplatesResultSchema,
  ListResourcesResultSchema,
  ListToolsResultSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { useMutation } from "@tanstack/react-query";
import { type PropsWithChildren, createContext, useContext } from "react";
import toast from "react-hot-toast";
import { useConfig, useConnection } from "../../../providers";

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

export type MCPScanPayload = {
  type: "tool" | "resource" | "prompt";
  name: string;
  description?: string;
};

function useMCPScanManager() {
  const { proxyAddress } = useConfig();
  const { serverCapabilities, makeRequest } = useConnection();

  const mutation = useMutation({
    mutationKey: ["mcp-scan"],
    mutationFn: async () => {
      const entries: MCPScanPayload[] = [];
      const promises = [];

      const start = performance.now();

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

      const response = await fetch(`${proxyAddress}/api/scanning`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entries),
      });

      if (!response.ok) {
        throw new Error(
          `Verification API error: ${
            response.status
          } - ${await response.text()}`,
        );
      }

      return {
        duration: performance.now() - start,
        tools: (
          (await response.json()) as (MCPScanPayload & {
            errors: string[];
          })[]
        ).map((tool) => ({
          ...tool,
          errors: tool.errors.map(
            (error) =>
              // Captialize the first letter of the error message
              error.charAt(0).toUpperCase() + error.slice(1),
          ),
        })),
      };
    },
    onError: (err) => {
      console.error(err);

      toast.error(err.message);
    },
  });

  return mutation;
}

export const useMCPScan = () => {
  const context = useContext(MCPScanContext);

  if (!context) throw new Error("Missing MCPScanContext.Provider in the tree!");

  return context;
};
