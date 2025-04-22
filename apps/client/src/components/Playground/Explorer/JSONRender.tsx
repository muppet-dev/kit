import { CopyButton } from "@/components/CopyButton";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tool } from "@/constants";
import { getToolName } from "@/lib/utils";
import { useConnection, useTheme, useTool } from "@/providers";
import {
  type ClientRequest,
  CompatibilityCallToolResultSchema,
  GetPromptResultSchema,
  ReadResourceResultSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { Editor as MonacoEditor, type OnMount } from "@monaco-editor/react";
import { AlignLeft } from "lucide-react";
import { useState } from "react";

export function JSONRender(props: { name: string }) {
  const { activeTool } = useTool();
  const [editor, setEditor] = useState<string>();
  const [editorInstance, setEditorInstance] =
    useState<Parameters<OnMount>[0]>();
  const { makeRequest } = useConnection();
  const { resolvedTheme } = useTheme();

  const handleEditorMount: OnMount = (editor) => setEditorInstance(editor);

  const handleFormat = () => {
    if (editorInstance)
      editorInstance.getAction("editor.action.formatDocument")?.run();
  };

  const onSend = async () => {
    const values = editor ? JSON.parse(editor) : undefined;

    const request: ClientRequest =
      activeTool.name === Tool.TOOLS
        ? {
            method: "tools/call",
            params: {
              name: props.name,
              arguments: values,
            },
          }
        : activeTool.name === Tool.PROMPTS
        ? {
            method: "prompts/get",
            params: {
              name: props.name,
              arguments: values,
            },
          }
        : {
            method: "resources/read",
            params: {
              name: props.name,
              uri: values.enpoint,
            },
          };

    const schema =
      activeTool.name === Tool.TOOLS
        ? CompatibilityCallToolResultSchema
        : activeTool.name === Tool.PROMPTS
        ? GetPromptResultSchema
        : ReadResourceResultSchema;

    await makeRequest(request, schema).catch((err) => console.error(err));
  };

  return (
    <>
      <div className="border w-full relative h-[400px] border-secondary-200 dark:border-secondary-800 overflow-hidden">
        <MonacoEditor
          language="json"
          onMount={handleEditorMount}
          theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
          className="h-full"
          value={editor}
          onChange={setEditor}
          loading={
            <div className="flex h-full w-full items-center justify-center gap-1">
              {/* <Spinner size="sm" /> */}
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
          <CopyButton data={editor ? editor : undefined} />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                disabled={!editor}
                onClick={handleFormat}
                onKeyDown={handleFormat}
              >
                <AlignLeft className="size-4 stroke-2" />
              </Button>
            </TooltipTrigger>
            <TooltipContent hidden={!editor}>Format Code</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="flex items-center justify-end">
        <Button
          className="flex items-center justify-end"
          onClick={onSend}
          onKeyDown={onSend}
        >
          Send {getToolName(activeTool.name)}
        </Button>
      </div>
    </>
  );
}
