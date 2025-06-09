import { eventHandler } from "@/client/lib/eventHandler";
import { cn } from "@/client/lib/utils";
import { Editor as MonacoEditor, type OnMount } from "@monaco-editor/react";
import { AlignLeft } from "lucide-react";
import { type ComponentProps, useState } from "react";
import { Theme, usePreferences } from "../providers";
import { CopyButton } from "./CopyButton";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export type CodeEditor = {
  value?: string;
  onValueChange: (value?: string) => void;
  className?: ComponentProps<"div">["className"];
  language?: string;
};

export function CodeEditor({
  value,
  onValueChange,
  className,
  language = "json",
}: CodeEditor) {
  const [editorInstance, setEditorInstance] =
    useState<Parameters<OnMount>[0]>();
  const { resolvedTheme } = usePreferences();

  const handleEditorMount: OnMount = (editor) => setEditorInstance(editor);
  const handleFormatCode = eventHandler(() => {
    if (editorInstance)
      editorInstance.getAction("editor.action.formatDocument")?.run();
  });

  return (
    <div
      className={cn("border w-full relative h-full overflow-hidden", className)}
    >
      <MonacoEditor
        language={language}
        onMount={handleEditorMount}
        theme={resolvedTheme === Theme.DARK ? "vs-dark" : "light"}
        className="h-full"
        value={value}
        onChange={onValueChange}
        loading={
          <div className="flex h-full w-full items-center justify-center gap-1">
            <Spinner />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        }
        options={{
          minimap: {
            enabled: false,
          },
        }}
      />
      <div className="absolute top-2 right-4 flex items-center gap-2">
        <CopyButton data={value} />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              disabled={!value}
              onClick={handleFormatCode}
              onKeyDown={handleFormatCode}
            >
              <AlignLeft className="size-4 stroke-2" />
            </Button>
          </TooltipTrigger>
          <TooltipContent hidden={!value}>Format Code</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
