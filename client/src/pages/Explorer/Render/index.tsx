import { highlightMatches } from "@/components/highlightMatches";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { eventHandler } from "@/lib/eventHandler";
import { cn } from "@/lib/utils";
import { useConnection } from "@/providers";
import {
  ListPromptsResultSchema,
  ListResourceTemplatesResultSchema,
  ListResourcesResultSchema,
  ListToolsResultSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { useQuery } from "@tanstack/react-query";
import Fuse, { type RangeTuple } from "fuse.js";
import { useEffect, useMemo, useState } from "react";
import { DEFAULT_TOOLS, Tool, useTool } from "../providers";
import { RequestResponseRender } from "./RequestResponse";
import { ToolsTabs } from "./Tabs";
import { CircleX } from "lucide-react";
import type {
  DynamicResourceItemType,
  MCPItemType,
  PromptItemType,
  StaticResourceItemType,
  ToolItemType,
} from "../types";

export function ExplorerRender() {
  const [current, setCurrent] = useState<string>();
  const [search, setSearch] = useState<string>("");
  const { activeTool } = useTool();
  const { makeRequest, mcpClient } = useConnection();

  const { data: cards, isLoading } = useQuery({
    queryKey: ["explorer", activeTool.name],
    queryFn: async (): Promise<MCPItemType[] | undefined> => {
      let handler: Promise<typeof cards> | undefined;

      switch (activeTool.name) {
        case Tool.TOOLS:
          handler = makeRequest(
            { method: "tools/list" },
            ListToolsResultSchema,
          ).then(({ tools }) =>
            tools.map(
              (tool) =>
                ({
                  type: Tool.TOOLS,
                  name: tool.name,
                  description: tool.description,
                  schema: tool.inputSchema.properties as ToolItemType["schema"],
                }) satisfies ToolItemType,
            ),
          );
          break;
        case Tool.PROMPTS:
          handler = makeRequest(
            {
              method: "prompts/list",
            },
            ListPromptsResultSchema,
          ).then(({ prompts }) =>
            prompts.map(
              (prompt) =>
                ({
                  type: Tool.PROMPTS,
                  name: prompt.name,
                  description: prompt.description,
                  schema: prompt.arguments,
                }) satisfies PromptItemType,
            ),
          );
          break;
        case Tool.STATIC_RESOURCES:
          handler = makeRequest(
            {
              method: "resources/list",
            },
            ListResourcesResultSchema,
          ).then(({ resources }) =>
            resources.map(
              (resource) =>
                ({
                  ...resource,
                  type: Tool.STATIC_RESOURCES,
                }) satisfies StaticResourceItemType,
            ),
          );
          break;
        case Tool.DYNAMIC_RESOURCES:
          handler = makeRequest(
            {
              method: "resources/templates/list",
            },
            ListResourceTemplatesResultSchema,
          ).then(({ resourceTemplates }) =>
            resourceTemplates.map(
              (resource) =>
                ({
                  ...resource,
                  type: Tool.DYNAMIC_RESOURCES,
                }) satisfies DynamicResourceItemType,
            ),
          );
          break;
      }

      return await handler;
    },
    enabled: !!mcpClient,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setCurrent(undefined);
  }, [activeTool]);

  const parsedItems = useMemo<
    (MCPItemType & { matches?: RangeTuple[] })[] | undefined
  >(() => {
    if (!search.trim() || !cards || cards.length === 0) return cards;

    const fuse = new Fuse(cards ?? [], {
      keys: ["name", "description"],
      includeMatches: true,
    });

    return fuse.search(search).map(({ item, matches }) => ({
      ...item,
      matches: matches?.flatMap((match) => match.indices),
    }));
  }, [search, cards]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center gap-1.5 size-full select-none text-muted-foreground">
        <Spinner className="size-5 min-w-5 min-h-5" />
        <p className="text-sm">Loading...</p>
      </div>
    );

  if (!parsedItems || parsedItems.length === 0)
    return (
      <div className="flex items-center justify-center gap-1.5 size-full select-none text-muted-foreground">
        <CircleX className="size-5 min-w-5 min-h-5" />
        <p className="text-sm">No data found</p>
      </div>
    );

  const handleSelectItem = (name: string) =>
    eventHandler(() => setCurrent(name));

  const activeToolName =
    DEFAULT_TOOLS.find((tool) => tool.name === activeTool.name)?.label ??
    activeTool.name;

  return (
    <div className="size-full grid grid-cols-1 lg:grid-cols-2 overflow-y-auto bg-muted/40">
      <div className="overflow-y-auto flex flex-col gap-2 w-full">
        <ToolsTabs />
        {parsedItems.length >= 5 && (
          <Input
            type="search"
            value={search}
            placeholder={`Search ${activeToolName}...`}
            onChange={(e) => setSearch(e.target.value)}
          />
        )}
        <div className="flex flex-col overflow-y-auto flex-1">
          {parsedItems.map((card) => (
            <Card
              key={card.name}
              className={cn(
                card.name === current
                  ? "bg-white dark:bg-background"
                  : "bg-transparent hover:bg-white dark:hover:bg-background transition-all ease-in-out",
                "relative gap-0 py-2 shadow-none border-0 first-of-type:border-t border-b rounded-none select-none cursor-pointer h-max",
              )}
              onClick={handleSelectItem(card.name)}
              onKeyDown={handleSelectItem(card.name)}
            >
              {card.name === current && (
                <div className="h-full w-1 bg-primary absolute left-0 top-0" />
              )}
              <CardHeader className="px-4 -mb-1">
                <CardTitle className="text-sm font-normal flex justify-between">
                  <p>
                    {card.matches
                      ? highlightMatches(card.name, card.matches)
                      : card.name}
                  </p>
                  {(card.type === Tool.DYNAMIC_RESOURCES ||
                    card.type === Tool.STATIC_RESOURCES) && (
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
      <div className="lg:pl-4 overflow-y-auto grid grid-rows-2 w-full bg-white dark:bg-background lg:border-l lg:pt-4">
        {current ? (
          <RequestResponseRender cards={cards} current={current} />
        ) : (
          <div className="row-span-2 flex items-center justify-center size-full select-none text-muted-foreground">
            <p className="text-sm">Select a {activeToolName}</p>
          </div>
        )}
      </div>
    </div>
  );
}
