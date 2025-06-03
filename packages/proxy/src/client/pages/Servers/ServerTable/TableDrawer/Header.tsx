import { Button } from "@/client/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/client/components/ui/tooltip";
import { eventHandler } from "@/client/lib/eventHandler";
import { cn } from "@/client/lib/utils";
import { ChevronDown, ChevronUp, X } from "lucide-react";

export type DrawerHeader = {
  data?: Record<string, any>;
} & PreviousServerButton &
  NextServerButton &
  CloseDrawerButton;

export function DrawerHeader(props: DrawerHeader) {
  return (
    <div className="flex items-center gap-2">
      <ServerName name={props.data?.server.name ?? "N/A"} />
      <ServerStatus status={props.data?.server.status} />
      <div className="flex-1" />
      <PreviousServerButton
        disabledPrevButton={props.disabledPrevButton}
        goToPreviousServer={props.goToPreviousServer}
      />
      <NextServerButton
        disabledNextButton={props.disabledNextButton}
        goToNextServer={props.goToNextServer}
      />
      <Divider />
      <CloseDrawerButton closeDrawer={props.closeDrawer} />
    </div>
  );
}

function ServerName(props: { name: string }) {
  return (
    <kbd className="text-foreground bg-secondary border px-1.5 text-sm font-medium shadow max-w-[150px] truncate">
      {props.name}
    </kbd>
  );
}

function ServerStatus(props: { status?: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            "size-2 rounded-full",
            props.status === "online"
              ? "bg-success"
              : props.status === "offline"
              ? "bg-secondary-foreground/60"
              : "bg-destructive"
          )}
        />
      </TooltipTrigger>
      <TooltipContent>{props.status}</TooltipContent>
    </Tooltip>
  );
}

type PreviousServerButton = {
  disabledPrevButton: boolean;
  goToPreviousServer: () => void;
};

function PreviousServerButton(props: PreviousServerButton) {
  const handleGoToPreviousServer = eventHandler(() =>
    props.goToPreviousServer()
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="p-1 size-max"
          disabled={props.disabledPrevButton}
          onClick={handleGoToPreviousServer}
          onKeyDown={handleGoToPreviousServer}
        >
          <ChevronUp />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Go to previous server</TooltipContent>
    </Tooltip>
  );
}

type NextServerButton = {
  disabledNextButton: boolean;
  goToNextServer: () => void;
};

function NextServerButton(props: NextServerButton) {
  const handleGoToNextServer = eventHandler(() => props.goToNextServer());

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="p-1 size-max"
          disabled={props.disabledNextButton}
          onClick={handleGoToNextServer}
          onKeyDown={handleGoToNextServer}
        >
          <ChevronDown />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Go to next Server</TooltipContent>
    </Tooltip>
  );
}

function Divider() {
  return <div className="h-4 w-px bg-muted" />;
}

type CloseDrawerButton = {
  closeDrawer: () => void;
};

function CloseDrawerButton(props: CloseDrawerButton) {
  const handleCloseDrawer = eventHandler(() => props.closeDrawer());

  return (
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
  );
}
