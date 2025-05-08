import { useConnection } from "@/providers";
import {
  CallToolResultSchema,
  GetPromptResultSchema,
  ReadResourceResultSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { useMutation } from "@tanstack/react-query";
import { type FieldValues, FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Tool } from "../../providers";
import { ReponseRender } from "./Reponse";
import { RequestTabs } from "./RequestTabs";
import type { MCPItemType } from "../../types";

export type RequestResponseRender = {
  selected: MCPItemType;
};

export function RequestResponseRender({ selected }: RequestResponseRender) {
  const { makeRequest } = useConnection();

  const methods = useForm();

  const { handleSubmit } = methods;

  const mutation = useMutation({
    mutationFn: async (values: FieldValues) => {
      let handler: Promise<unknown> | undefined;

      switch (selected.type) {
        case Tool.TOOLS:
          handler = makeRequest(
            {
              method: "tools/call",
              params: {
                name: selected.name,
                arguments: values,
              },
            },
            CallToolResultSchema,
          );
          break;
        case Tool.PROMPTS:
          handler = makeRequest(
            {
              method: "prompts/get",
              params: {
                name: selected.name,
                arguments: values,
              },
            },
            GetPromptResultSchema,
          );
          break;
        case Tool.STATIC_RESOURCES:
          handler = makeRequest(
            {
              method: "resources/read",
              params: {
                uri: selected.uri,
              },
            },
            ReadResourceResultSchema,
          );
          break;
        case Tool.DYNAMIC_RESOURCES:
          handler = makeRequest(
            {
              method: "resources/read",
              params: {
                uri: fillTemplate(selected.uriTemplate, values),
              },
            },
            ReadResourceResultSchema,
          );
          break;
      }

      if (!handler) {
        throw new Error("MCP client is not available");
      }

      const startTime = performance.now();
      const result = await handler;
      return {
        duration: performance.now() - startTime,
        content: result,
      };
    },
    onSuccess: () => {
      toast.success("Request completed successfully!");
    },
    onError: (error) => {
      console.error("Request failed:", error);

      toast.error(error.message);
    },
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(
          (values) => mutation.mutateAsync(values),
          console.error,
        )}
        className="h-full flex"
      >
        <RequestTabs selected={selected} />
      </form>
      <ReponseRender data={mutation.data} />
    </FormProvider>
  );
}

const fillTemplate = (
  template: string,
  values: Record<string, string>,
): string => {
  return template.replace(/{([^}]+)}/g, (_, key) => values[key] || `{${key}}`);
};
