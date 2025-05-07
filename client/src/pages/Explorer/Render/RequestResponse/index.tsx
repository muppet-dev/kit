import { useConnection } from "@/providers";
import {
  CallToolResultSchema,
  GetPromptResultSchema,
  ReadResourceResultSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { useMutation } from "@tanstack/react-query";
import { type FieldValues, FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Tool, useTool } from "../../providers";
import { ReponseRender } from "./Reponse";
import { RequestTabs } from "./RequestTabs";

export type RequestResponseRender = {
  cards: RequestTabs["selectedCard"][];
  current: string;
};

export function RequestResponseRender({
  cards,
  current,
}: RequestResponseRender) {
  const { activeTool } = useTool();
  const { makeRequest } = useConnection();

  const methods = useForm();

  const { handleSubmit } = methods;

  const selectedCard = cards.find((card) => card.name === current);

  const mutation = useMutation({
    mutationFn: async (values: FieldValues) => {
      let handler: Promise<unknown> | undefined;

      switch (activeTool.name) {
        case Tool.TOOLS:
          handler = makeRequest(
            {
              method: "tools/call",
              params: {
                name: current,
                arguments: values,
              },
            },
            CallToolResultSchema
          );
          break;
        case Tool.PROMPTS:
          handler = makeRequest(
            {
              method: "prompts/get",
              params: {
                name: current,
                arguments: values,
              },
            },
            GetPromptResultSchema
          );
          break;
        case Tool.STATIC_RESOURCES:
          handler = makeRequest(
            {
              method: "resources/read",
              params: {
                uri: selectedCard?.uri as string,
              },
            },
            ReadResourceResultSchema
          );
          break;
        case Tool.DYNAMIC_RESOURCES:
          handler = makeRequest(
            {
              method: "resources/read",
              params: {
                uri: fillTemplate(selectedCard?.uriTemplate as string, values),
              },
            },
            ReadResourceResultSchema
          );
          break;
        default:
          throw new Error(`Invalid active tool - ${activeTool.name}`);
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

  if (selectedCard)
    return (
      <>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(
              (values) => mutation.mutateAsync(values),
              console.error
            )}
            className="h-full flex"
          >
            <RequestTabs current={current} selectedCard={selectedCard} />
          </form>
        </FormProvider>
        <ReponseRender data={mutation.data} />
      </>
    );
}

const fillTemplate = (
  template: string,
  values: Record<string, string>
): string => {
  return template.replace(/{([^}]+)}/g, (_, key) => values[key] || `{${key}}`);
};
