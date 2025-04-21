import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tool } from "@/constants";
import { cn, getToolName } from "@/lib/utils";
import { useConnection, useTool } from "@/providers";
import { useEffect, useState } from "react";
import { FormRender } from "./FormRender";
import { JSONRender } from "./JSONRender";

export function ScannerPage() {
  const [cards, setCards] = useState<
    { name: string; description?: string; schema?: unknown }[]
  >([]);
  const [current, setCurrent] = useState<string>();

  const { activeTool } = useTool();
  const { mcpClient } = useConnection();

  useEffect(() => {
    if (!mcpClient) return;

    if (activeTool.name === Tool.TOOLS) {
      mcpClient.listTools().then(({ tools }) =>
        setCards(
          tools.map((tool) => ({
            name: tool.name,
            description: tool.description,
            schema: tool.inputSchema.properties,
          }))
        )
      );
    } else if (activeTool.name === Tool.PROMPTS) {
      mcpClient.listPrompts().then(({ prompts }) =>
        setCards(
          prompts.map((prompt) => ({
            name: prompt.name,
            description: prompt.description,
            schema: prompt.arguments,
          }))
        )
      );
    } else if (activeTool.name === Tool.STATIC_RESOURCES) {
      mcpClient.listResources().then(({ resources }) => setCards(resources));
    } else if (activeTool.name === Tool.DYNAMIC_RESOURCES) {
      mcpClient
        .listResourceTemplates()
        .then(({ resourceTemplates }) => setCards(resourceTemplates));
    }
  }, [mcpClient, activeTool]);

  const onClick = (name: string) => setCurrent(name);

  return (
    <div className="size-full flex overflow-y-auto">
      <div className="overflow-y-auto w-full">
        <div className="flex flex-col">
          {cards.map((card) => (
            <Card
              key={card.name}
              className={cn(
                card.name === current
                  ? "bg-white"
                  : "bg-transparent hover:bg-white transition-all ease-in-out",
                "relative gap-0 py-2 shadow-none border-0 first-of-type:border-t border-b rounded-none select-none cursor-pointer h-max"
              )}
              onClick={() => onClick(card.name)}
              onKeyDown={() => onClick(card.name)}
            >
              {card.name === current && (
                <div className="h-full w-1 bg-primary absolute left-0 top-0" />
              )}
              <CardHeader className="px-4 -mb-1">
                <CardTitle className="text-sm font-normal">
                  {card.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4">
                <CardDescription className="line-clamp-1 leading-tight tracking-tight">
                  {card.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className="px-4 overflow-y-auto flex w-full bg-white border-l">
        {current ? (
          <Tabs defaultValue="form" className="size-full">
            <TabsList>
              <TabsTrigger
                value="form"
                className="data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-primary cursor-pointer py-2 px-5"
              >
                Form
              </TabsTrigger>
              <TabsTrigger
                value="json"
                className="data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-primary cursor-pointer py-2 px-5"
              >
                JSON
              </TabsTrigger>
              <TabsTrigger
                value="score"
                className="data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-primary cursor-pointer py-2 px-5"
              >
                Score
              </TabsTrigger>
            </TabsList>
            <TabsContent value="form">
              <FormRender
                schema={
                  cards.find((card) => card.name === current)?.schema as Record<
                    string,
                    unknown
                  >
                }
              />
            </TabsContent>
            <TabsContent value="json" className="space-y-2">
              <JSONRender />
            </TabsContent>
            <TabsContent value="score">Score</TabsContent>
          </Tabs>
        ) : (
          <div className="flex items-center justify-center size-full select-none text-muted-foreground">
            <p className="text-sm">Select a {getToolName(activeTool.name)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
