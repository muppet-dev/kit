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
import Fuse, { type RangeTuple } from "fuse.js";
import { CircleX } from "lucide-react";
import { useMemo, useState } from "react";
import { DEFAULT_TOOLS, Tool, useTool } from "../providers";
import { useMCPItem } from "../providers/item";
import type { MCPItemType } from "../types";
import { RequestResponseRender } from "./RequestResponse";
import { ToolsTabs } from "./Tabs";

export function ExplorerRender() {
  const [search, setSearch] = useState<string>("");
  const { activeTool } = useTool();
  const { items, isLoading, selectedItem, changeSelectedItem } = useMCPItem();

  const parsedItems = useMemo<
    (MCPItemType & { matches?: RangeTuple[] })[] | undefined
  >(() => {
    if (!search.trim() || !items || items.length === 0) return items;

    const fuse = new Fuse(items ?? [], {
      keys: ["name", "description"],
      includeMatches: true,
    });

    return fuse.search(search).map(({ item, matches }) => ({
      ...item,
      matches: matches?.flatMap((match) => match.indices),
    }));
  }, [search, items]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center gap-1.5 size-full select-none text-muted-foreground">
        <Spinner className="size-5 min-w-5 min-h-5" />
        <p className="text-sm">Loading data...</p>
      </div>
    );

  if (!items || items.length === 0)
    return (
      <div className="flex items-center justify-center gap-1.5 size-full select-none text-muted-foreground">
        <CircleX className="size-5 min-w-5 min-h-5" />
        <p className="text-sm">No data found</p>
      </div>
    );

  const handleSelectItem = (name: string) =>
    eventHandler(() => changeSelectedItem(name));

  const activeToolName =
    DEFAULT_TOOLS.find((tool) => tool.name === activeTool.name)?.label ??
    activeTool.name;

  return (
    <div className="size-full grid grid-cols-1 lg:grid-cols-2 overflow-y-auto bg-muted/40">
      <div className="overflow-y-auto flex flex-col gap-2 w-full">
        <ToolsTabs />
        {items?.length >= 5 && (
          <Input
            type="search"
            value={search}
            placeholder={`Search ${activeToolName}...`}
            onChange={(e) => setSearch(e.target.value)}
          />
        )}
        <div className="flex flex-col overflow-y-auto flex-1">
          {parsedItems?.map((card) => (
            <Card
              key={card.name}
              className={cn(
                card.name === selectedItem?.name
                  ? "bg-white dark:bg-background"
                  : "bg-transparent hover:bg-white dark:hover:bg-background transition-all ease-in-out",
                "relative gap-0 py-2 shadow-none border-0 first-of-type:border-t border-b rounded-none select-none cursor-pointer h-max"
              )}
              onClick={handleSelectItem(card.name)}
              onKeyDown={handleSelectItem(card.name)}
            >
              {card.name === selectedItem?.name && (
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
        <RequestResponseRender />
      </div>
    </div>
  );
}
