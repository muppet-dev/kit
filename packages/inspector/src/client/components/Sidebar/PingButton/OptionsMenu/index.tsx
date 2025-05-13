import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/client/components/ui/dropdown-menu";
import { CustomTimeIntervalDialog } from "./Dialog";
import { SidebarMenuAction } from "@/client/components/ui/sidebar";
import { usePingServer } from "@/client/providers";
import { Ellipsis } from "lucide-react";
import { useState, type BaseSyntheticEvent } from "react";

export function OptionsMenu() {
  const [isCustomTimeDialogOpen, setCustomTimeDialogOpen] = useState(false);
  const { timeInterval, setTimeInterval, clearTimeInterval } = usePingServer();

  const handleSetTimeInterval =
    (time: 10 | 60 | 300 | 600) => (event: BaseSyntheticEvent) => {
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
            onClick={handleSetTimeInterval(10)}
            onKeyDown={handleSetTimeInterval(10)}
          >
            In every 10 sec
          </DropdownMenuItem>
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
          {timeInterval && (
            <DropdownMenuItem
              onClick={handleClearTimeInterval}
              onKeyDown={handleClearTimeInterval}
            >
              Cancel time interval
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <CustomTimeIntervalDialog
        open={isCustomTimeDialogOpen}
        onOpenChange={setCustomTimeDialogOpen}
      />
    </>
  );
}
