import { eventHandler } from "../../lib/eventHandler";
import { cn } from "../../lib/utils";
import { useConnection } from "../../providers";
import { ConnectionStatus } from "../../providers/connection/manager";
import { RotateCcw, Unplug } from "lucide-react";
import { Button } from "../ui/button";
import { useSidebar } from "../ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function ConnectStatus() {
  const { connectionStatus, disconnect, connect } = useConnection();
  const { state, open } = useSidebar();

  const connectionTitle = getConnectionStatusTitle(connectionStatus);

  const handleConnect = eventHandler(() => connect());
  const handleDisconnect = eventHandler(() => disconnect());

  return (
    <div
      className={cn(
        "flex gap-2 w-full items-end text-sm h-8",
        !open && "py-2 pl-2"
      )}
    >
      <Tooltip>
        <TooltipTrigger>
          <div
            className={cn(
              "rounded-full",
              state !== "collapsed"
                ? "size-2 ml-1 mb-1.5"
                : "size-2.5 ml-[3px]",
              connectionStatus === ConnectionStatus.CONNECTED
                ? "bg-green-500 dark:bg-green-300"
                : connectionStatus === ConnectionStatus.ERROR ||
                  connectionStatus ===
                    ConnectionStatus.ERROR_CONNECTING_TO_PROXY
                ? "bg-red-500 dark:bg-red-300"
                : connectionStatus === ConnectionStatus.CONNECTING
                ? "bg-yellow-500 dark:bg-yellow-300"
                : "bg-gray-500 dark:bg-gray-300"
            )}
          />
        </TooltipTrigger>
        <TooltipContent side={state !== "collapsed" ? "top" : "right"}>
          {connectionTitle}
        </TooltipContent>
      </Tooltip>
      {state !== "collapsed" && (
        <p className="text-muted-foreground font-medium select-none">
          {connectionTitle}
        </p>
      )}
      {state !== "collapsed" &&
        connectionStatus === ConnectionStatus.CONNECTED && (
          <>
            <div className="flex-1" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-max has-[>svg]:px-1.5 px-1.5 py-1.5"
                  onClick={handleDisconnect}
                  onKeyDown={handleDisconnect}
                >
                  <Unplug />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Disconnect</TooltipContent>
            </Tooltip>
          </>
        )}
      {state !== "collapsed" &&
        (connectionStatus === ConnectionStatus.ERROR ||
          connectionStatus === ConnectionStatus.ERROR_CONNECTING_TO_PROXY ||
          connectionStatus === ConnectionStatus.DISCONNECTED) && (
          <>
            <div className="flex-1" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-max has-[>svg]:px-1.5 px-1.5 py-1.5"
                  onClick={handleConnect}
                  onKeyDown={handleConnect}
                >
                  <RotateCcw />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Reconnect</TooltipContent>
            </Tooltip>
          </>
        )}
    </div>
  );
}

const getConnectionStatusTitle = (status: ConnectionStatus) => {
  switch (status) {
    case ConnectionStatus.CONNECTED:
      return "Connected";
    case ConnectionStatus.DISCONNECTED:
      return "Disconnected";
    case ConnectionStatus.ERROR:
      return "Connection Error";
    case ConnectionStatus.CONNECTING:
      return "Connecting";
    case ConnectionStatus.ERROR_CONNECTING_TO_PROXY:
      return "Error connecting to proxy";
  }
};
