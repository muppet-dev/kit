import { Button } from "@/client/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/client/components/ui/tooltip";
import { eventHandler } from "@/client/lib/eventHandler";
import { cn } from "@/client/lib/utils";
import { useServerData } from "@/client/queries/useServerData";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { InspectorDialog } from "./InspectorDialog";
import { ServerCapabilitiesTable } from "./ServerCapabilitiesTable";

export type TableDrawer = {
  selected?: string;
  setSelected: React.Dispatch<React.SetStateAction<string | undefined>>;
  data: Record<string, any>[];
};

export function TableDrawer({
  selected,
  setSelected,
  data: serversData,
}: TableDrawer) {
  const { data, isLoading } = useServerData({ id: selected });

  const handleGoToPreviosRequest = eventHandler(() =>
    setSelected((prev) => {
      const index = serversData.findIndex((item) => item.id === selected);

      if (index != null && index > 0) {
        return serversData[index - 1].id;
      }

      return prev;
    })
  );
  const handleGoToNextRequest = eventHandler(() =>
    setSelected((prev) => {
      const index = serversData.findIndex((item) => item.id === selected);

      if (index != null && index < serversData.length - 1) {
        return serversData[index + 1].id;
      }

      return prev;
    })
  );

  const handleCloseDrawer = eventHandler(() => setSelected(undefined));

  const selectedIndex = serversData.findIndex((item) => item.id === selected);

  if (selected)
    return (
      <div className="p-4 w-[550px] border space-y-3 h-full overflow-y-auto">
        <div className="flex items-center gap-2">
          <kbd className="text-foreground bg-secondary border px-1.5 text-sm font-medium shadow max-w-[150px] truncate">
            {data?.server.name ?? "N/A"}
          </kbd>
          <div
            className={cn(
              "size-2 rounded-full",
              data?.server.status === "online"
                ? "bg-success"
                : data?.server.status === "offline"
                ? "bg-secondary-foreground/60"
                : "bg-destructive"
            )}
          />
          <div className="flex-1" />
          <InspectorDialog data={data} />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="p-1 size-max"
                disabled={selected != null && selectedIndex === 0}
                onClick={handleGoToPreviosRequest}
                onKeyDown={handleGoToPreviosRequest}
              >
                <ChevronUp />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Previous request</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="p-1 size-max"
                disabled={
                  selected != null && selectedIndex === serversData.length - 1
                }
                onClick={handleGoToNextRequest}
                onKeyDown={handleGoToNextRequest}
              >
                <ChevronDown />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Next request</TooltipContent>
          </Tooltip>
          <div className="h-4 w-px bg-muted" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="p-1 size-max"
                onClick={handleCloseDrawer}
                onKeyDown={handleCloseDrawer}
              >
                <X />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Close</TooltipContent>
          </Tooltip>
        </div>
        <ServerCapabilitiesTable data={data} isLoading={isLoading} />
      </div>
    );
}
