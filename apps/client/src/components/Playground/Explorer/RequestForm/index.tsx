import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tool } from "@/constants";
import { useConnection, useTool } from "@/providers";
import { TabsContent } from "@radix-ui/react-tabs";
import { SendHorizonal } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FormRender } from "./FormRender";
import { JSONRender } from "./JSONRender";
import { ReponseRender } from "./Reponse";
import type { JSONSchema7 } from "json-schema";

export type RequestForm = {
  cards: {
    name: string;
    description?: string;
    schema?: FormRender["schema"];
    uri?: string;
    uriTemplate?: string;
  }[];
  current: string;
};

export function RequestForm({ cards, current }: RequestForm) {
  const { activeTool } = useTool();
  const { mcpClient } = useConnection();

  const [response, setResponse] = useState<unknown>();

  const methods = useForm();

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const formSchema = cards.find((card) => card.name === current)?.schema;

  const selectedResource = cards.find((card) => card.name === current);

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(async (values) => {
            let handler: Promise<unknown> | undefined;

            switch (activeTool.name) {
              case Tool.TOOLS:
                handler = mcpClient?.callTool({
                  name: current,
                  arguments: values,
                });
                break;
              case Tool.PROMPTS:
                handler = mcpClient?.getPrompt({
                  name: current,
                  arguments: values,
                });
                break;
              case Tool.STATIC_RESOURCES:
                handler = mcpClient?.readResource({
                  uri: selectedResource?.uri as string,
                });
                break;
              case Tool.DYNAMIC_RESOURCES:
                handler = mcpClient?.readResource({
                  uri: fillTemplate(
                    selectedResource?.uriTemplate as string,
                    values
                  ),
                });
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
          }, console.error)}
          className="size-full overflow-y-auto"
        >
          <Tabs defaultValue="form" className="size-full overflow-y-auto">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger
                  value="form"
                  className="data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-primary cursor-pointer py-2 px-5 dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
                >
                  Form
                </TabsTrigger>
                <TabsTrigger
                  value="json"
                  className="data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-primary cursor-pointer py-2 px-5 dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
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
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-3 py-1.5"
              >
                Send
                <SendHorizonal />
              </Button>
            </div>
            <TabsContent
              value="form"
              className="h-full flex flex-col gap-2 overflow-y-auto"
            >
              <FormRender
                schema={
                  formSchema ??
                  (selectedResource?.uriTemplate
                    ?.match(/{([^}]+)}/g)
                    ?.map((param) => {
                      const key = param.slice(1, -1);
                      return key;
                    }) as JSONSchema7[])
                }
              />
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
