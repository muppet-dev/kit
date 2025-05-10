import type { RangeTuple } from "fuse.js";
import type { MCPItemType } from "../types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/client/components/ui/card";
import { useMCPItem, Tool } from "../providers";
import { cn } from "@/client/lib/utils";
import { eventHandler } from "@/client/lib/eventHandler";
import { highlightMatches } from "@/client/components/highlightMatches";

export type MCPItem = MCPItemType & {
  matches?: RangeTuple[];
};

export function MCPItem(props: MCPItem) {
  const { selectedItem, changeSelectedItem } = useMCPItem();

  const handleSelectItem = (name: string) =>
    eventHandler(() => changeSelectedItem(name));

  return (
    <Card
      key={props.name}
      className={cn(
        props.name === selectedItem?.name
          ? "bg-white dark:bg-background"
          : "bg-transparent hover:bg-white dark:hover:bg-background transition-all ease-in-out",
        "relative gap-0 py-2 shadow-none border-0 first-of-type:border-t border-b rounded-none select-none cursor-pointer h-max",
      )}
      onClick={handleSelectItem(props.name)}
      onKeyDown={handleSelectItem(props.name)}
    >
      {props.name === selectedItem?.name && (
        <div className="h-full w-1 bg-primary absolute left-0 top-0" />
      )}
      <CardHeader className="px-4 -mb-1">
        <CardTitle className="text-sm font-normal flex justify-between">
          <p>
            {props.matches
              ? highlightMatches(props.name, props.matches)
              : props.name}
          </p>
          {(props.type === Tool.DYNAMIC_RESOURCES ||
            props.type === Tool.STATIC_RESOURCES) && (
            <span className="italic text-zinc-500 dark:text-zinc-400">
              {props.mimeType}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      {props.description && (
        <CardContent className="px-4">
          <CardDescription className="line-clamp-1 leading-tight tracking-tight">
            {props.description}
          </CardDescription>
        </CardContent>
      )}
    </Card>
  );
}
