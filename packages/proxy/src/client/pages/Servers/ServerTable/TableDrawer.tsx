import { Button } from "@/client/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/client/components/ui/tooltip";
import { eventHandler } from "@/client/lib/eventHandler";
import { useServerData } from "@/client/queries/useServerData";
import { X } from "lucide-react";

export type TableDrawer = {
  selected?: string;
  setSelected: (id?: string) => void;
};

export function TableDrawer({ selected, setSelected }: TableDrawer) {
  const { data } = useServerData({ id: selected });

  const handleCloseDrawer = eventHandler(() => setSelected());

  if (selected)
    return (
      <div className="p-4 w-[550px] border space-y-3 h-full overflow-y-auto">
        <div className="flex items-center justify-between">
          <kbd className="text-foreground bg-secondary border px-1.5 text-sm font-medium shadow">
            {data?.name ?? "N/A"}
          </kbd>
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
      </div>
    );
}
