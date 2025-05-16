import { CodeHighlighter } from "@/client/components/Hightlighter";

export type JSONRender = {
  content?: {
    contents: { type: "text"; text: string }[];
  };
};

export function JSONRender(props: JSONRender) {
  if (props.content)
    return (
      <>
        {props.content.contents.map((item, index) => {
          if ("text" in item) {
            return <TextRender key={`item-${index + 1}`} content={item.text} />;
          }
          return <p key={`item-${index + 1}`}>Unable to parse value</p>;
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
