import { highlightMatches } from "../../../components/highlightMatches";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { eventHandler } from "../../../lib/eventHandler";
import { cn } from "../../../lib/utils";
import { Tool, useMCPItem } from "../providers";
import type { MCPItemType } from "../types";
import type { FuseResultMatch } from "fuse.js";

export type MCPItem = MCPItemType & {
  matches?: FuseResultMatch[];
};

export function MCPItem(props: MCPItem) {
  const { selectedItem, changeSelectedItem } = useMCPItem();

  const handleSelectItem = (name: string) =>
    eventHandler(() => changeSelectedItem(name));

  let nameMatches = undefined;
  let descriptionMatches = undefined;

  props.matches?.map((item) => {
    if (item.key === "name") nameMatches = item.indices;
    if (item.key === "description") descriptionMatches = item.indices;
  });

  return (
    <Card
      key={props.name}
      className={cn(
        props.name === selectedItem?.name
          ? "bg-white dark:bg-background"
          : "bg-transparent hover:bg-white dark:hover:bg-background transition-all ease-in-out",
        "relative gap-0 py-2 shadow-none border-0 first-of-type:border-t border-b rounded-none select-none cursor-pointer h-max"
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
            {nameMatches
              ? highlightMatches(props.name, nameMatches)
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
          <CardDescription
            title={props.description}
            className="line-clamp-2 leading-tight tracking-tight"
          >
            {descriptionMatches
              ? highlightMatches(props.description, descriptionMatches)
              : props.description}
          </CardDescription>
        </CardContent>
      )}
    </Card>
  );
}
