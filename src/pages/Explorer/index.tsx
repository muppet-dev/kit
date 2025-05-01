import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tool } from "@/constants";
import { cn } from "@/lib/utils";
import { useConnection } from "@/providers";
import { useEffect, useState } from "react";
import { RequestForm } from "./RequestForm";
import { DEFAULT_TOOLS, useTool } from "./tools";

export default function ExplorerPage() {
  const [cards, setCards] = useState<RequestForm["cards"]>([]);
  const [current, setCurrent] = useState<string>();

  const { activeTool } = useTool();
  const { mcpClient } = useConnection();

  useEffect(() => {
    if (!mcpClient) return;

    let handler: Promise<typeof cards> | undefined;

    switch (activeTool.name) {
      case Tool.TOOLS:
        handler = mcpClient.listTools().then(({ tools }) =>
          tools.map((tool) => ({
            name: tool.name,
            description: tool.description,
            schema: tool.inputSchema
              .properties as RequestForm["cards"][0]["schema"],
          }))
        );
        break;
      case Tool.PROMPTS:
        handler = mcpClient.listPrompts().then(({ prompts }) =>
          prompts.map((prompt) => ({
            name: prompt.name,
            description: prompt.description,
            schema: prompt.arguments as RequestForm["cards"][0]["schema"],
          }))
        );
        break;
      case Tool.STATIC_RESOURCES:
        handler = mcpClient.listResources().then(({ resources }) => resources);
        break;
      case Tool.DYNAMIC_RESOURCES:
        handler = mcpClient
          .listResourceTemplates()
          .then(({ resourceTemplates }) => resourceTemplates);
        break;
    }

    handler?.then((data) => setCards(data));
  }, [mcpClient, activeTool]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setCurrent(undefined);
  }, [activeTool]);

  const handleCardSelect = (name: string) => setCurrent(name);

  return (
    <div className="size-full flex overflow-y-auto">
      <div className="overflow-y-auto w-full">
        <div className="flex flex-col">
          {cards.map((card) => (
            <Card
              key={card.name}
              className={cn(
                card.name === current
                  ? "bg-white dark:bg-background"
                  : "bg-transparent hover:bg-white dark:hover:bg-background transition-all ease-in-out",
                "relative gap-0 py-2 shadow-none border-0 first-of-type:border-t border-b rounded-none select-none cursor-pointer h-max"
              )}
              onClick={() => handleCardSelect(card.name)}
              onKeyDown={() => handleCardSelect(card.name)}
            >
              {card.name === current && (
                <div className="h-full w-1 bg-primary absolute left-0 top-0" />
              )}
              <CardHeader className="px-4 -mb-1">
                <CardTitle className="text-sm font-normal flex justify-between">
                  {card.name}
                  {card.mimeType && (
                    <span className="italic text-zinc-500 dark:text-zinc-400">
                      {card.mimeType}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              {card.description && (
                <CardContent className="px-4">
                  <CardDescription className="line-clamp-1 leading-tight tracking-tight">
                    {card.description}
                  </CardDescription>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
      <div className="px-4 overflow-y-auto flex flex-col gap-2 w-full bg-white dark:bg-background border-l">
        {current ? (
          <RequestForm cards={cards} current={current} />
        ) : (
          <div className="flex items-center justify-center size-full select-none text-muted-foreground">
            <p className="text-sm">Select a {getToolName(activeTool.name)}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function getToolName(name: Tool) {
  return DEFAULT_TOOLS.find((tool) => tool.name === name)?.label ?? name;
}
