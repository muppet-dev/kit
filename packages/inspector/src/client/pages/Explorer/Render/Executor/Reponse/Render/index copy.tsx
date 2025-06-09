import { defaultMakdownComponents } from "@/client/components/MakdownComponents";
import { CodeHighlighter } from "../../../../../../components/Hightlighter";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  CallToolResult,
  GetPromptResult,
  ReadResourceResult,
} from "@modelcontextprotocol/sdk/types.js";

export type FormattedDataRender = {
  result?: CallToolResult | GetPromptResult | ReadResourceResult;
};

export function FormattedDataRender(props: FormattedDataRender) {
  if (!props.result) return;

  // Result of tool calling
  if ("content" in props.result) {
  }

  return (
    <>
      {content.map((item, index) => {
        if ("type" in item) {
          if (item.type === "image" && "mimeType" in item && "data" in item) {
            const imageURL = `data:${item.mimeType};base64,${item.data}`;

            return (
              <img
                key={`item-${index + 1}`}
                src={imageURL}
                alt="Rendered content"
                className="size-full object-contain"
              />
            );
          }
        }

        if ("text" in item) {
          if ("mimeType" in item)
            return (
              <Markdown
                remarkPlugins={[remarkGfm]}
                components={defaultMakdownComponents}
                key={`item-${index + 1}`}
              >
                {item.text}
              </Markdown>
            );
          return <TextRender key={`item-${index + 1}`} content={item.text} />;
        }

        return (
          <div
            key={`item-${index + 1}`}
            className="size-full flex items-center justify-center text-muted-foreground select-none"
          >
            Unable to parse value
          </div>
        );
      })}
    </>
  );
}

function TextRender({ content }: { content: string }) {
  const { success, data } = tryParseJson(content);

  return (
    <CodeHighlighter
      content={success ? JSON.stringify(data, null, 2) : String(data)}
    />
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
