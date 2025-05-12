import type { JSONSchema7Definition } from "json-schema";
import type { Tool } from "../providers";

export type MCPItemType =
  | ToolItemType
  | PromptItemType
  | DynamicResourceItemType
  | StaticResourceItemType;

export type ToolItemType = {
  type: Tool.TOOLS;
  name: string;
  description?: string;
  schema:
    | {
        [key: string]: JSONSchema7Definition;
      }
    | undefined;
  inputSchema: unknown;
};

export type PromptItemType = {
  type: Tool.PROMPTS;
  name: string;
  description?: string;
  schema?: { name: string; description?: string; required?: boolean }[];
};

export type DynamicResourceItemType = {
  type: Tool.DYNAMIC_RESOURCES;
  name: string;
  description?: string;
  uriTemplate: string;
  mimeType?: string;
};

export type StaticResourceItemType = {
  type: Tool.STATIC_RESOURCES;
  name: string;
  description?: string;
  uri: string;
  mimeType?: string;
};
