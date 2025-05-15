import { CodeHighlighter } from "@/client/components/Hightlighter";

export type JSONRender = {
  content: unknown;
};

export function JSONRender(props: JSONRender) {
  return <CodeHighlighter content={JSON.stringify(props.content, null, 2)} />;
}
