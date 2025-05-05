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
import { useConnection } from "@/providers";
import {
  ListPromptsResultSchema,
  ListResourceTemplatesResultSchema,
  ListResourcesResultSchema,
  ListToolsResultSchema,
} from "@modelcontextprotocol/sdk/types.js";
import Fuse, { type RangeTuple } from "fuse.js";
import { useEffect, useMemo, useState } from "react";
import { cn } from "../../lib/utils";
import { RequestForm } from "./RequestForm";
import { DEFAULT_TOOLS, Tool, useTool } from "./tools";

type Cards = RequestForm["cards"][0];

interface CardType extends Cards {
  matches?: RangeTuple[];
}

export function Explorer() {
  const [isLoading, setIsLoading] = useState(false);
  const [cards, setCards] = useState<CardType[]>([]);
  const [current, setCurrent] = useState<string>();
  const [search, setSearch] = useState<string>("");

  const { activeTool } = useTool();
  const { makeRequest, mcpClient } = useConnection();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!mcpClient) return;

    let handler: Promise<typeof cards> | undefined;

    setIsLoading(true);
    switch (activeTool.name) {
      case Tool.TOOLS:
        handler = makeRequest(
          { method: "tools/list" },
          ListToolsResultSchema
        ).then(({ tools }) =>
          tools.map((tool) => ({
            name: tool.name,
            description: tool.description,
            schema: tool.inputSchema
              .properties as RequestForm["cards"][0]["schema"],
          }))
        );
        break;
      case Tool.PROMPTS:
        handler = makeRequest(
          {
            method: "prompts/list",
          },
          ListPromptsResultSchema
        ).then(({ prompts }) =>
          prompts.map((prompt) => ({
            name: prompt.name,
            description: prompt.description,
            schema: prompt.arguments as RequestForm["cards"][0]["schema"],
          }))
        );
        break;
      case Tool.STATIC_RESOURCES:
        handler = makeRequest(
          {
            method: "resources/list",
          },
          ListResourcesResultSchema
        ).then(({ resources }) => resources);
        break;
      case Tool.DYNAMIC_RESOURCES:
        handler = makeRequest(
          {
            method: "resources/templates/list",
          },
          ListResourceTemplatesResultSchema
        ).then(({ resourceTemplates }) => resourceTemplates);
        break;
    }

    handler?.then((data) => {
      setCards(data);
      setIsLoading(false);
    });
  }, [activeTool, mcpClient]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setCurrent(undefined);
  }, [activeTool]);

  const fuse = useMemo(
    () =>
      new Fuse(cards ?? [], {
        keys: ["name"],
        includeMatches: true,
      }),
    [cards]
  );

  let searchResults: CardType[] | undefined = cards;

  if (search) {
    const results = fuse.search(search);

    searchResults = results.reduce<typeof searchResults>(
      (prev, { item, matches }) => {
        prev?.push({
          ...item,
          matches: matches?.flatMap((match) => match.indices),
        });

        return prev;
      },
      []
    );
  }

  const addCurrentCardName = (name: string) =>
    eventHandler(() => setCurrent(name));

  if (isLoading)
    return (
      <div className="flex items-center justify-center gap-1.5 size-full select-none text-muted-foreground">
        <Spinner className="size-5 min-w-5 min-h-5" />
        <p className="text-sm">Loading...</p>
      </div>
    );

  return (
    <div className="size-full grid grid-cols-1 lg:grid-cols-2 overflow-y-auto">
      <div className="overflow-y-auto w-full">
        {cards.length >= 5 && (
          <Input
            type="search"
            value={search}
            placeholder={`Search ${getToolName(activeTool.name)}...`}
            className="mb-2"
            onChange={(e) => setSearch(e.target.value)}
          />
        )}
        <div className="flex flex-col">
          {searchResults.map((card) => (
            <Card
              key={card.name}
              className={cn(
                card.name === current
                  ? "bg-white dark:bg-background"
                  : "bg-transparent hover:bg-white dark:hover:bg-background transition-all ease-in-out",
                "relative gap-0 py-2 shadow-none border-0 first-of-type:border-t border-b rounded-none select-none cursor-pointer h-max"
              )}
              onClick={addCurrentCardName(card.name)}
              onKeyDown={addCurrentCardName(card.name)}
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
      <div className="pl-4 overflow-y-auto flex flex-col gap-2 w-full bg-white dark:bg-background border-l">
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

function getToolName(name: Tool) {
  return DEFAULT_TOOLS.find((tool) => tool.name === name)?.label ?? name;
}
