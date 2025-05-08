import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import Fuse, { type RangeTuple } from "fuse.js";
import { CircleX } from "lucide-react";
import { useMemo, useState } from "react";
import { DEFAULT_TOOLS, useTool, useMCPItem } from "../providers";
import type { MCPItemType } from "../types";
import { MCPItem } from "./MCPItem";
import { RequestResponseRender } from "./RequestResponse";
import { ToolsTabs } from "./Tabs";

export function ExplorerRender() {
  const [search, setSearch] = useState<string>("");
  const { activeTool } = useTool();
  const { items, isLoading } = useMCPItem();

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
            <MCPItem key={card.name} {...card} />
          ))}
        </div>
      </div>
      <div className="lg:pl-4 overflow-y-auto grid grid-rows-2 w-full bg-white dark:bg-background lg:border-l lg:pt-4">
        <RequestResponseRender />
      </div>
    </div>
  );
}
