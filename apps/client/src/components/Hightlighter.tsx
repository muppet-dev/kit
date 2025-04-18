import { useShiki } from "../providers/shiki";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";

export type CodeHighlighter = { content: string };

export function CodeHighlighter({ content }: CodeHighlighter) {
  const highlighter = useShiki();
  const [html, setHtml] = useState("");

  if (!highlighter)
    return (
      <div className="h-full space-y-2 py-3">
        <Skeleton className="h-5 w-1/2 rounded" />
        <Skeleton className="h-5 w-full rounded" />
        <Skeleton className="h-5 w-full rounded" />
        <Skeleton className="h-5 w-3/4 rounded" />
        <Skeleton className="h-5 w-1/4 rounded" />
      </div>
    );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    highlighter
      .codeToHtml(content, {
        lang: "json",
        theme: "github-light-default",
      })
      .then((val) => setHtml(val));
  }, []);

  return (
    <div
      className="h-max min-h-full w-max min-w-full"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Need this to show the highlighting
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
