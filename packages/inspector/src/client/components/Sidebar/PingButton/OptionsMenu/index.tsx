import { ConnectionStatus } from "@/client/providers/connection/manager";
import { Ellipsis, X } from "lucide-react";
import { type BaseSyntheticEvent, useState } from "react";
import { useConnection, usePingServer } from "../../../../providers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import { SidebarMenuAction } from "../../../ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../ui/tooltip";
import { CustomTimeIntervalDialog } from "./Dialog";

export function OptionsMenu() {
  const [isCustomTimeDialogOpen, setCustomTimeDialogOpen] = useState(false);
  const { timeInterval, setTimeInterval, clearTimeInterval } = usePingServer();
  const { connectionStatus } = useConnection();

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
            className="text-destructive hover:text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/10 peer-hover/menu-button:text-destructive rounded-sm"
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
        <DropdownMenuTrigger
          disabled={connectionStatus !== ConnectionStatus.CONNECTED}
          asChild
        >
          <SidebarMenuAction className="data-[state=open]:bg-sidebar-accent disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:[&>svg]:text-sidebar-accent-foreground/50 rounded-sm data-[state=open]:text-accent-foreground">
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
