import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useConnection } from "@/providers";
import {
  CallToolResultSchema,
  GetPromptResultSchema,
  ReadResourceResultSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { SendHorizonal } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Tool, useTool } from "../tools";
import { DynamicResourceFieldRender } from "./DynamicResourceFieldRender";
import { FormRender } from "./FormRender";
import { GenerateButton } from "./GenerateButton";
import { JSONRender } from "./JSONRender";
import { PromptFieldRender } from "./PromptFieldRender";
import { ReponseRender } from "./Reponse";

export type RequestForm = {
  cards: {
    name: string;
    description?: string;
    schema?: FormRender["schema"] | PromptFieldRender["schema"];
    uri?: string;
    uriTemplate?: string;
    mimeType?: string;
  }[];
  current: string;
};

export function RequestForm({ cards, current }: RequestForm) {
  const { activeTool } = useTool();
  const { makeRequest } = useConnection();

  const [response, setResponse] = useState<{
    duration: number;
    content: unknown;
  }>();

  const methods = useForm();

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const selectedCard = cards.find((card) => card.name === current);

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(async (values) => {
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
                      uri: fillTemplate(
                        selectedCard?.uriTemplate as string,
                        values
                      ),
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
            await handler
              .then((res) =>
                setResponse({
                  duration: performance.now() - startTime,
                  content: res,
                })
              )
              .catch((err) => console.error(err));
          }, console.error)}
          className="size-full overflow-y-auto"
        >
          <Tabs
            defaultValue={
              activeTool.name === Tool.STATIC_RESOURCES ? "score" : "form"
            }
            className="size-full overflow-y-auto"
          >
            <div className="flex items-center justify-between gap-2">
              <TabsList>
                <TabsTrigger
                  value="form"
                  className="data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-primary cursor-pointer py-2 px-5 dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
                  disabled={activeTool.name === Tool.STATIC_RESOURCES}
                >
                  Form
                </TabsTrigger>
                <TabsTrigger
                  value="json"
                  className="data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-primary cursor-pointer py-2 px-5 dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
                  disabled={activeTool.name === Tool.STATIC_RESOURCES}
                >
                  JSON
                </TabsTrigger>
                <TabsTrigger
                  value="score"
                  className="data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-primary cursor-pointer py-2 px-5 dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
                >
                  Score
                </TabsTrigger>
              </TabsList>
              <div className="flex-1" />
              {activeTool.name === Tool.TOOLS && (
                <GenerateButton selected={selectedCard} />
              )}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-3 py-1.5"
              >
                {isSubmitting && <Spinner className="size-4 min-w-4 min-h-4" />}
                {isSubmitting ? "Sending" : "Send"}
                <SendHorizonal />
              </Button>
            </div>
            <TabsContent
              value="form"
              className="h-full flex flex-col gap-2 overflow-y-auto"
            >
              {activeTool.name === Tool.TOOLS && (
                <FormRender
                  schema={selectedCard?.schema as FormRender["schema"]}
                />
              )}
              {activeTool.name === Tool.PROMPTS && (
                <PromptFieldRender
                  schema={selectedCard?.schema as PromptFieldRender["schema"]}
                  selectedPromptName={current}
                />
              )}
              {activeTool.name === Tool.DYNAMIC_RESOURCES && (
                <DynamicResourceFieldRender
                  uriTemplate={selectedCard?.uriTemplate}
                />
              )}
            </TabsContent>
            <TabsContent
              value="json"
              className="h-full flex flex-col gap-2 overflow-y-auto"
            >
              <JSONRender />
            </TabsContent>
            <TabsContent value="score">Score</TabsContent>
          </Tabs>
        </form>
      </FormProvider>
      <ReponseRender data={response} />
    </>
  );
}

const fillTemplate = (
  template: string,
  values: Record<string, string>
): string => {
  return template.replace(/{([^}]+)}/g, (_, key) => values[key] || `{${key}}`);
};
