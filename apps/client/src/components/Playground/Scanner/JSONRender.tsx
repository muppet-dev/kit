import { CodeHighlighter } from "@/components/Hightlighter";

const DATA = `{
    "name":"sample",
    "description": "sample description"
  }`;

export function JSONRender() {
  const content = JSON.stringify(JSON.parse(DATA), null, 2);

  return (
    <div className="[&>div>pre]:p-2 [&>div>pre]:rounded-lg [&>div>pre]:border">
      <CodeHighlighter content={content} />
    </div>
  );
}
