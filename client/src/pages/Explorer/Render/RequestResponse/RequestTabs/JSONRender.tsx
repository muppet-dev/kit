import { CopyButton } from "@/components/CopyButton";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { eventHandler } from "@/lib/eventHandler";
import { useTheme } from "@/providers";
import { Editor as MonacoEditor, type OnMount } from "@monaco-editor/react";
import { AlignLeft } from "lucide-react";
import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

export function JSONRender() {
  const { control, reset } = useFormContext();

  const formData = useWatch({ control });

  const [editorInstance, setEditorInstance] =
    useState<Parameters<OnMount>[0]>();
  const { resolvedTheme } = useTheme();

  const handleEditorMount: OnMount = (editor) => setEditorInstance(editor);

  const handleFormatCode = eventHandler(() => {
    if (editorInstance)
      editorInstance.getAction("editor.action.formatDocument")?.run();
  });

  const value = formData ? JSON.stringify(formData, null, 2) : undefined;

  return (
    <div className="border w-full relative h-full border-secondary-200 dark:border-secondary-800 overflow-hidden">
      <MonacoEditor
        language="json"
        onMount={handleEditorMount}
        theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
        className="h-full"
        value={value}
        onChange={(value) => {
          const data = value ? JSON.parse(value) : undefined;
          reset(data);
        }}
        loading={
          <div className="flex h-full w-full items-center justify-center gap-1">
            <Spinner />
            <p className="text-sm text-secondary-500 dark:text-secondary-400">
              Loading...
            </p>
          </div>
        }
        options={{
          minimap: {
            enabled: false,
          },
        }}
      />
      <div className="absolute top-2 right-4 flex items-center gap-2">
        <CopyButton data={value ? value : undefined} />
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
