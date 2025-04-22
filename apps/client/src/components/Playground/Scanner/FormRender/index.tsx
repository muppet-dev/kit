import { Tool } from "@/constants";
import { getToolName } from "@/lib/utils";
import { useConnection, useTool } from "@/providers";
import { DuckForm } from "duck-form";
import { Form } from "./Form";
import { quackFields } from "./fields";
import { CodeHighlighter } from "@/components/Hightlighter";
import { useState } from "react";
import type { JSONSchema7 } from "json-schema";

export type FormRenderProps = {
  name: string;
  schema?: JSONSchema7["properties"] | JSONSchema7[];
};

export function FormRender(props: FormRenderProps) {
  const [response, setResponse] = useState<unknown>();
  const { activeTool } = useTool();
  const { mcpClient } = useConnection();

  if (!props.schema) return <></>;

  return (
    <>
      <DuckForm
        components={quackFields}
        generateId={(_, props) => (props.id ? String(props.id) : undefined)}
      >
        <Form
          onSubmit={async (values) => {
            let handler: Promise<unknown> | undefined;

            switch (activeTool.name) {
              case Tool.TOOLS:
                handler = mcpClient?.callTool({
                  name: props.name,
                  arguments: values,
                });
                break;
              case Tool.PROMPTS:
                handler = mcpClient?.getPrompt({
                  name: props.name,
                  arguments: values,
                });
                break;
              case Tool.STATIC_RESOURCES:
                handler = mcpClient?.readResource({ uri: props.name });
                break;
              case Tool.DYNAMIC_RESOURCES:
                // TODO: place the values in the URI
                handler = mcpClient?.readResource({ uri: props.name });
                break;
              default:
                throw new Error(`Invalid active tool - ${activeTool.name}`);
            }

            if (!handler) {
              throw new Error("MCP client is not available");
            }

            handler
              .then((res) => setResponse(res))
              .catch((err) => console.error(err));
          }}
          schema={props.schema}
          toolName={getToolName(activeTool.name)}
        />
      </DuckForm>
      {response && (
        <>
          <h2 className="text-lg font-semibold">Response</h2>
          <CodeHighlighter content={JSON.stringify(response, null, 2)} />
        </>
      )}
    </>
  );
}
