import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/client/components/ui/dropdown-menu";
import { CustomTimeIntervalDialog } from "./Dialog";
import { SidebarMenuAction } from "@/client/components/ui/sidebar";
import { usePingServer } from "@/client/providers";
import { Ellipsis, X } from "lucide-react";
import { useState, type BaseSyntheticEvent } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/client/components/ui/tooltip";

export function OptionsMenu() {
  const [isCustomTimeDialogOpen, setCustomTimeDialogOpen] = useState(false);
  const { timeInterval, setTimeInterval, clearTimeInterval } = usePingServer();

  const handleSetTimeInterval =
    (time: 60 | 300 | 600) => (event: BaseSyntheticEvent) => {
      if ("key" in event && event.key !== "Enter") return;
      setTimeInterval(time);
    };

  const handleClearTimeInterval = (event: BaseSyntheticEvent) => {
    if ("key" in event && event.key !== "Enter") return;
    clearTimeInterval();
  };

  const handleOpenCustomTimeDialog = (event: BaseSyntheticEvent) => {
    if ("key" in event && event.key !== "Enter") return;
    setCustomTimeDialogOpen(true);
  };

  if (timeInterval)
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <SidebarMenuAction
            onClick={handleClearTimeInterval}
            onKeyDown={handleClearTimeInterval}
            className="text-red-500 dark:text-red-300 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-300/20 peer-hover/menu-button:text-red-500"
          >
            <X className="size-3.5" />
          </SidebarMenuAction>
        </TooltipTrigger>
        <TooltipContent>Disable auto ping</TooltipContent>
      </Tooltip>
    );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction className="data-[state=open]:bg-sidebar-accent">
            <Ellipsis />
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start">
          <DropdownMenuItem
            onClick={handleSetTimeInterval(60)}
            onKeyDown={handleSetTimeInterval(60)}
          >
            In every 1 min
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleSetTimeInterval(300)}
            onKeyDown={handleSetTimeInterval(300)}
          >
            In every 5 min
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleSetTimeInterval(600)}
            onKeyDown={handleSetTimeInterval(600)}
          >
            In every 10 min
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleOpenCustomTimeDialog}
            onKeyDown={handleOpenCustomTimeDialog}
          >
            Custom
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CustomTimeIntervalDialog
        open={isCustomTimeDialogOpen}
        onOpenChange={setCustomTimeDialogOpen}
      />
    </>
  );
}
