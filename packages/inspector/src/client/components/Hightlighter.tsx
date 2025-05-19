import { useEffect, useState } from "react";
import { cn } from "../lib/utils";
import { Theme, useShiki, useTheme } from "../providers";
import { CopyButton } from "./CopyButton";
import { Skeleton } from "./ui/skeleton";

export type CodeHighlighter = { content: string; className?: string };

export function CodeHighlighter({ content, className }: CodeHighlighter) {
  const highlighter = useShiki();
  const [html, setHtml] = useState("");
  const { theme } = useTheme();

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
        theme:
          theme === Theme.LIGHT
            ? "github-light-default"
            : "github-dark-default",
      })
      .then((val) => setHtml(val));
  }, [content, theme]);

  return (
    <div className="relative size-full">
      <div
        className={cn(
          "p-2 bg-white border relative h-full overflow-y-auto dark:bg-[#0d1117]",
          className
        )}
      >
        <div
          className="h-max min-h-full w-max min-w-full"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Need this to show the highlighting
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
      <CopyButton
        data={content ? content : undefined}
        className="absolute right-1 top-1"
      />
    </div>
  );
}
