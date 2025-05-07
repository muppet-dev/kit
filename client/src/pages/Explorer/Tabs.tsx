import { Button } from "@/components/ui/button";
import {
  TabsList,
  Tabs as TabsPrimitive,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { eventHandler } from "@/lib/eventHandler";
import { useQueryClient } from "@tanstack/react-query";
import { RefreshCcwIcon } from "lucide-react";
import { useTool } from "./tools";

export function Tabs() {
  const { tools, activeTool, changeTool } = useTool();
  const queryClient = useQueryClient();

  const queryKey = ["explorer", activeTool.name];

  const queryState = queryClient.getQueryState(queryKey);

  const handleRefresh = eventHandler(() =>
    queryClient.refetchQueries({ queryKey })
  );

  return (
    <TabsPrimitive
      defaultValue={activeTool.name}
      onValueChange={(value) => changeTool(value)}
      className="w-full"
    >
      <TabsList className="w-full p-0 bg-background justify-start gap-4 text-md border-b rounded-none">
        {tools.map((tab) => (
          <TabsTrigger
            key={tab.name}
            value={tab.name}
            disabled={!tab.enabled}
            className="rounded-none bg-background h-full data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary dark:data-[state=active]:border-input/0 dark:data-[state=active]:border-b-foreground dark:data-[state=active]:bg-transparent max-w-max"
          >
            {tab.label}
          </TabsTrigger>
        ))}
        <div className="flex-1" />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="size-max has-[>svg]:px-1.5 py-1.5 mr-1"
              onClick={handleRefresh}
              onKeyDown={handleRefresh}
              disabled={queryState?.status !== "success"}
            >
              <RefreshCcwIcon className="size-4 stroke-2" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Refresh {activeTool.name}</TooltipContent>
        </Tooltip>
      </TabsList>
    </TabsPrimitive>
  );
}
