import { Tool } from "@/constants";
import { getToolName } from "@/lib/utils";
import { useConnection, useTool } from "@/providers";
import {
  type ClientRequest,
  CompatibilityCallToolResultSchema,
  GetPromptResultSchema,
  ReadResourceResultSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { DuckForm } from "duck-form";
import { Form } from "./Form";
import { quackFields } from "./fields";
import { Response } from "./Response";

export type FormRenderProps = {
  name: string;
  schema?: Record<string, unknown>;
};

export function FormRender(props: FormRenderProps) {
  const { activeTool } = useTool();
  const { makeRequest } = useConnection();

  if (!props.schema) return <></>;

  return (
    <>
      <DuckForm
        components={quackFields}
        generateId={(_, props) => (props.id ? String(props.id) : undefined)}
      >
        <Form
          onSubmit={async (values) => {
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

            await makeRequest(request, schema).catch((err) =>
              console.error(err)
            );
          }}
          schema={props.schema}
          toolName={getToolName(activeTool.name)}
        />
      </DuckForm>
      <Response />
    </>
  );
}
