import { Input } from "@/client/components/ui/input";
import { Spinner } from "@/client/components/ui/spinner";
import Fuse, { type FuseResultMatch } from "fuse.js";
import { CircleX } from "lucide-react";
import { useMemo, useState } from "react";
import { useMCPItem, useTool } from "../providers";
import type { MCPItemType } from "../types";
import { Executor } from "./Executor";
import { MCPItem } from "./MCPItem";
import { ToolsTabs } from "./Tabs";

export function GridComponent() {
  const [search, setSearch] = useState<string>("");
  const { items, isLoading } = useMCPItem();

  const parsedItems = useMemo<
    (MCPItemType & { matches?: FuseResultMatch[] })[] | undefined
  >(() => {
    if (!search.trim() || !items || items.length === 0) return items;

    const fuse = new Fuse(items, {
      keys: ["name", "description"],
      includeMatches: true,
    });

    return fuse.search(search).map(({ item, matches }) => ({
      ...item,
      matches,
    }));
  }, [search, items]);

  return (
    <div className="size-full grid grid-cols-1 lg:grid-cols-5 overflow-y-auto bg-muted/40">
      <div className="overflow-y-auto flex flex-col gap-2 w-full lg:col-span-2">
        <ToolsTabs />
        {(items?.length ?? 0) >= 5 && (
          <SearchField value={search} onValueChange={setSearch} />
        )}
        <CardsRender
          data={parsedItems}
          isLoading={isLoading}
          isEmpty={!items || items.length === 0}
        />
      </div>
      <Executor />
    </div>
  );
}

type SearchField = {
  value: string;
  onValueChange: (value: string) => void;
};

function SearchField(props: SearchField) {
  const { activeTool } = useTool();

  return (
    <Input
      type="search"
      value={props.value}
      placeholder={`Search ${activeTool.label}...`}
      onChange={(e) => props.onValueChange(e.target.value)}
    />
  );
}

type CardsRender = {
  data?: (MCPItemType & {
    matches?: FuseResultMatch[];
  })[];
  isLoading: boolean;
  isEmpty: boolean;
};

function CardsRender({ data, isLoading, isEmpty }: CardsRender) {
  if (isLoading) return <LoadingComponent />;
  if (isEmpty) return <EmptyComponent />;
  if (data)
    return (
      <div className="flex flex-col overflow-y-auto flex-1">
        {data.map((card) => (
          <MCPItem key={card.name} {...card} />
        ))}
      </div>
    );
}

function LoadingComponent() {
  return (
    <div className="flex items-center justify-center gap-1.5 size-full select-none text-muted-foreground">
      <Spinner className="size-5 min-w-5 min-h-5" />
      <p className="text-sm">Loading data...</p>
    </div>
  );
}

function EmptyComponent() {
  return (
    <div className="flex items-center justify-center gap-1.5 size-full select-none text-muted-foreground">
      <CircleX className="size-5 min-w-5 min-h-5" />
      <p className="text-sm">No data found</p>
    </div>
  );
}
