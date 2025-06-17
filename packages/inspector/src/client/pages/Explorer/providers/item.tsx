import {
  CallToolResultSchema,
  GetPromptResultSchema,
  ListPromptsResultSchema,
  ListResourceTemplatesResultSchema,
  ListResourcesResultSchema,
  ListToolsResultSchema,
  ReadResourceResultSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { useQuery } from "@tanstack/react-query";
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { FieldValues } from "react-hook-form";
import { useConfig, useConnection } from "../../../providers";
import type {
  DynamicResourceItemType,
  MCPItemType,
  PromptItemType,
  StaticResourceItemType,
  ToolItemType,
} from "../types";
import { Tool, useTool } from "./tools";

type MCPItemContextType = ReturnType<typeof useMCPItemManager>;

const MCPItemContext = createContext<MCPItemContextType | null>(null);

export const MCPItemProvider = (props: PropsWithChildren) => {
  const values = useMCPItemManager();

  return (
    <MCPItemContext.Provider value={values}>
      {props.children}
    </MCPItemContext.Provider>
  );
};

function useMCPItemManager() {
  const { activeTool } = useTool();
  const { makeRequest, mcpClient } = useConnection();
  const { connectionInfo } = useConfig();
  const [selectedItemName, setSelectedItemName] = useState<string | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setSelectedItemName(null);
  }, [activeTool]);

  function changeSelectedItem(name: string) {
    setSelectedItemName(name);
  }

  const queryKey = [connectionInfo, "explorer", activeTool.name];

  const {
    data: items,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      let handler: Promise<MCPItemType[]> | undefined;

      switch (activeTool.name) {
        case Tool.TOOLS:
          handler = makeRequest(
            { method: "tools/list" },
            ListToolsResultSchema,
          ).then(({ tools }) =>
            tools.map(
              (tool) =>
                ({
                  type: Tool.TOOLS,
                  name: tool.name,
                  description: tool.description,
                  schema: tool.inputSchema.properties as ToolItemType["schema"],
                  inputSchema: tool.inputSchema,
                }) satisfies ToolItemType,
            ),
          );
          break;
        case Tool.PROMPTS:
          handler = makeRequest(
            {
              method: "prompts/list",
            },
            ListPromptsResultSchema,
          ).then(({ prompts }) =>
            prompts.map(
              (prompt) =>
                ({
                  type: Tool.PROMPTS,
                  name: prompt.name,
                  description: prompt.description,
                  schema: prompt.arguments,
                }) satisfies PromptItemType,
            ),
          );
          break;
        case Tool.STATIC_RESOURCES:
          handler = makeRequest(
            {
              method: "resources/list",
            },
            ListResourcesResultSchema,
          ).then(({ resources }) =>
            resources.map(
              (resource) =>
                ({
                  ...resource,
                  type: Tool.STATIC_RESOURCES,
                }) satisfies StaticResourceItemType,
            ),
          );
          break;
        case Tool.DYNAMIC_RESOURCES:
          handler = makeRequest(
            {
              method: "resources/templates/list",
            },
            ListResourceTemplatesResultSchema,
          ).then(({ resourceTemplates }) =>
            resourceTemplates.map(
              (resource) =>
                ({
                  ...resource,
                  type: Tool.DYNAMIC_RESOURCES,
                }) satisfies DynamicResourceItemType,
            ),
          );
          break;
      }

      return await handler;
    },
    enabled:
      !!mcpClient &&
      activeTool.name !== Tool.ROOTS &&
      activeTool.name !== Tool.SAMPLING,
  });

  const selectedItem = useMemo(
    () => items?.find((item) => item.name === selectedItemName),
    [items, selectedItemName],
  );

  async function callItem(item: MCPItemType, values: FieldValues) {
    let handler: Promise<unknown> | undefined;

    switch (item.type) {
      case Tool.TOOLS:
        handler = makeRequest(
          {
            method: "tools/call",
            params: {
              name: item.name,
              arguments: values,
            },
          },
          CallToolResultSchema,
        );
        break;
      case Tool.PROMPTS:
        handler = makeRequest(
          {
            method: "prompts/get",
            params: {
              name: item.name,
              arguments: values,
            },
          },
          GetPromptResultSchema,
        );
        break;
      case Tool.STATIC_RESOURCES:
        handler = makeRequest(
          {
            method: "resources/read",
            params: {
              uri: item.uri,
            },
          },
          ReadResourceResultSchema,
        );
        break;
      case Tool.DYNAMIC_RESOURCES:
        handler = makeRequest(
          {
            method: "resources/read",
            params: {
              uri: fillTemplate(item.uriTemplate, values),
            },
          },
          ReadResourceResultSchema,
        );
        break;
    }

    if (!handler) {
      throw new Error("MCP client is not available");
    }

    return await handler;
  }

  return {
    items,
    isLoading,
    selectedItem,
    changeSelectedItem,
    refetch,
    isFetching,
    callItem,
  };
}

export const useMCPItem = () => {
  const context = useContext(MCPItemContext);

  if (!context) throw new Error("Missing MCPItemContext.Provider in the tree!");

  return context;
};

const fillTemplate = (
  template: string,
  values: Record<string, string>,
): string => {
  return template.replace(/{([^}]+)}/g, (_, key) => values[key] || `{${key}}`);
};
