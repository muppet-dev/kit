import { useEffect, useState } from "react";
import { cn } from "../lib/utils";
import { Theme, usePreferences, useShiki } from "../providers";
import { CopyButton } from "./CopyButton";
import { Skeleton } from "./ui/skeleton";

export type CodeHighlighter = { content: string; className?: string };

export function CodeHighlighter({ content, className }: CodeHighlighter) {
  const highlighter = useShiki();
  const [html, setHtml] = useState("");
  const { resolvedTheme } = usePreferences();

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
          resolvedTheme === Theme.LIGHT
            ? "github-light-default"
            : "github-dark-default",
      })
      .then((val) => setHtml(val));
  }, [content, resolvedTheme]);

  return (
    <div className="relative size-full overflow-y-auto">
      <div
        className={cn(
          "border relative size-full overflow-auto rounded-md",
          className,
        )}
      >
        <div
          className="h-max min-h-full w-max min-w-full flex [&>pre]:p-2 [&>pre]:min-h-full [&>pre]:min-w-full"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Need this to show the highlighting
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
      <CopyButton
        data={content ? content : undefined}
        className="absolute right-2 top-2 [&>svg]:size-3.5"
      />
    </div>
  );
}
