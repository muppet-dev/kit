import { CopyButton } from "@/components/CopyButton";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { eventHandler } from "@/lib/eventHandler";
import { useConnection, useTheme } from "@/providers";
import {
  EmptyResultSchema,
  type Request,
} from "@modelcontextprotocol/sdk/types.js";
import { Editor as MonacoEditor, type OnMount } from "@monaco-editor/react";
import { AlignLeft } from "lucide-react";
import { useState } from "react";

export type Editor = {
  request: Request;
  closeDialog: (value: boolean) => void;
};

export function Editor({ request, closeDialog }: Editor) {
  const [editorInstance, setEditorInstance] =
    useState<Parameters<OnMount>[0]>();
  const [value, setValue] = useState<string>(
    JSON.stringify(request.params, null, 2)
  );
  const { makeRequest } = useConnection();
  const { resolvedTheme } = useTheme();

  const handleEditorMount: OnMount = (editor) => setEditorInstance(editor);

  const onFormat = eventHandler(() => {
    if (editorInstance)
      editorInstance.getAction("editor.action.formatDocument")?.run();
  });

  const handleUpdateRequest = eventHandler(async () => {
    await makeRequest(
      {
        method: request.method as never,
        params: JSON.parse(value),
      },
      EmptyResultSchema.passthrough()
    );

    closeDialog?.(false);
  });

  return (
    <>
      <div className="border w-full relative h-[400px] border-secondary-200 dark:border-secondary-800 overflow-hidden">
        <MonacoEditor
          language="json"
          onMount={handleEditorMount}
          theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
          className="h-full"
          value={value}
          onChange={(value) => {
            if (value) {
              setValue(value);
            }
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
                onClick={onFormat}
                onKeyDown={onFormat}
              >
                <AlignLeft className="size-4 stroke-2" />
              </Button>
            </TooltipTrigger>
            <TooltipContent hidden={!value}>Format Code</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <Button
        className="w-max ml-auto"
        onClick={handleUpdateRequest}
        onKeyDown={handleUpdateRequest}
      >
        Update
      </Button>
    </>
  );
}
