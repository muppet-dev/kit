import { CodeHighlighter } from "@/client/components/Hightlighter";
import { defaultMakdownComponents } from "@/client/components/MakdownComponents";
import type { TextContent } from "@modelcontextprotocol/sdk/types.js";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function JsonRender(props: TextContent) {
  const { success, data } = tryParseJson(props.text);

  if (success)
    return <CodeHighlighter content={JSON.stringify(data, null, 2)} />;

  return (
    <Markdown remarkPlugins={[remarkGfm]} components={defaultMakdownComponents}>
      {props.text}
    </Markdown>
  );
}

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | JsonValue[]
  | { [key: string]: JsonValue };

export type JsonObject = { [key: string]: JsonValue };

export type DataType =
  | "string"
  | "number"
  | "bigint"
  | "boolean"
  | "symbol"
  | "undefined"
  | "object"
  | "function"
  | "array"
  | "null";

export function tryParseJson(str: string): {
  success: boolean;
  data: JsonValue;
} {
  const trimmed = str.trim();
  if (
    !(trimmed.startsWith("{") && trimmed.endsWith("}")) &&
    !(trimmed.startsWith("[") && trimmed.endsWith("]"))
  ) {
    return { success: false, data: str };
  }
  try {
    return { success: true, data: JSON.parse(str) };
  } catch {
    return { success: false, data: str };
  }
}
