import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tool } from "@/constants";
import { getToolName } from "@/lib/utils";
import { useConnection, useTool } from "@/providers";
import {
  type ClientRequest,
  CompatibilityCallToolResultSchema,
  GetPromptResultSchema,
  ReadResourceResultSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { Blueprint, DuckField, DuckForm } from "duck-form";
import { FormProvider, useForm } from "react-hook-form";
import { Fragment } from "react/jsx-runtime";
import { quackFields } from "./fields";
import { FieldWrapper } from "./fields/FieldWrapper";

export type FormRenderProps = {
  name: string;
  schema?: Record<string, unknown>;
};

export function FormRender(props: FormRenderProps) {
  const { activeTool } = useTool();
  const { makeRequest } = useConnection();
  const methods = useForm();

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  if (!props.schema) {
    return <></>;
  }

  return (
    <DuckForm
      components={quackFields}
      generateId={(_, props) => (props.id ? String(props.id) : undefined)}
    >
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(async (values) => {
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
          }, console.error)}
          className="space-y-2"
        >
          <Blueprint wrapper={FieldWrapper} schema={props.schema}>
            {Object.keys(props.schema).map((key) => (
              <Fragment key={key}>
                <Label className="mb-1">{key}</Label>
                <DuckField id={key} />
              </Fragment>
            ))}
          </Blueprint>
          <Button type="submit" disabled={isSubmitting}>
            Run {getToolName(activeTool.name)}
          </Button>
        </form>
      </FormProvider>
    </DuckForm>
  );
}
