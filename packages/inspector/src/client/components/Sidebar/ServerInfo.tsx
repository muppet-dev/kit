import { Copy, Ellipsis, RotateCcw, Unplug } from "lucide-react";
import {
  type BaseSyntheticEvent,
  type PropsWithChildren,
  useMemo,
} from "react";
import { eventHandler } from "../../lib/eventHandler";
import { cn } from "../../lib/utils";
import { useConfig, useConnection } from "../../providers";
import { ConnectionStatus } from "../../providers/connection/manager";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useSidebar } from "../ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import toast from "react-hot-toast";

export function ServerInfo() {
  const { mcpClient, connectionStatus } = useConnection();
  const { open } = useSidebar();

  const serverInfo = mcpClient?.getServerVersion();

  if (!open)
    return (
      <div className="flex gap-2 w-full items-end h-8 p-2">
        <ConnectStatus />
      </div>
    );

  return (
    <div className="p-2 flex gap-1 flex-col w-full border bg-background dark:bg-background/50">
      {connectionStatus === "connected" ? (
        <div className="pl-1 flex justify-between items-center text-sm select-none">
          <p className="font-semibold line-clamp-1" title={serverInfo?.name}>
            {serverInfo?.name}
          </p>
          <p className="text-muted-foreground">v{serverInfo?.version}</p>
        </div>
      ) : (
        <p className="text-center text-sm text-muted-foreground select-none">
          No Server
        </p>
      )}
      <div className="flex gap-2 w-full items-end text-sm h-8">
        <ConnectStatus />
        {connectionStatus === ConnectionStatus.CONNECTED && (
          <>
            <div className="flex-1" />
            <ConnectedServerOptionsMenu />
          </>
        )}
        {(connectionStatus === ConnectionStatus.ERROR ||
          connectionStatus === ConnectionStatus.ERROR_CONNECTING_TO_PROXY ||
          connectionStatus === ConnectionStatus.DISCONNECTED) && (
          <>
            <div className="flex-1" />
            <ReconnectButton />
          </>
        )}
      </div>
    </div>
  );
}

function ConnectStatus() {
  const { connectionStatus } = useConnection();
  const { open } = useSidebar();

  const connectionTitle = useMemo(() => {
    switch (connectionStatus) {
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
  }, [connectionStatus]);

  const TooltipWrapper = (props: PropsWithChildren) => {
    if (open) return <>{props.children}</>;
    return (
      <Tooltip>
        <TooltipTrigger>{props.children}</TooltipTrigger>
        <TooltipContent side="right">{connectionTitle}</TooltipContent>
      </Tooltip>
    );
  };

  return (
    <>
      <TooltipWrapper>
        <div
          className={cn(
            "rounded-full",
            open ? "size-2 ml-1 mb-1.5" : "size-2.5 ml-[3px]",
            connectionStatus === ConnectionStatus.CONNECTED
              ? "bg-success"
              : connectionStatus === ConnectionStatus.ERROR ||
                  connectionStatus ===
                    ConnectionStatus.ERROR_CONNECTING_TO_PROXY
                ? "bg-destructive"
                : connectionStatus === ConnectionStatus.CONNECTING
                  ? "bg-warning"
                  : "bg-secondary-foreground/60",
          )}
        />
      </TooltipWrapper>
      {open && (
        <p className="text-muted-foreground font-medium text-sm select-none">
          {connectionTitle}
        </p>
      )}
    </>
  );
}

function ConnectedServerOptionsMenu() {
  const { disconnect } = useConnection();
  const { connectionInfo } = useConfig();
  const [_, copyToClipboard] = useCopyToClipboard();

  const handleDisconnect = (event: BaseSyntheticEvent) => {
    if ("key" in event && event.key !== "Enter") return;
    disconnect();
  };

  const serverEntry = useMemo(() => {
    switch (connectionInfo?.type) {
      case "stdio":
        return {
          command: connectionInfo.command,
          args: connectionInfo.args ? [connectionInfo.args] : undefined,
          env: connectionInfo.env,
        };
      case "sse":
        return {
          type: connectionInfo?.type,
          url: connectionInfo?.url,
          note: "For SSE connections, add this URL directly in your MCP Client",
        };
      case "streamable-http":
        return {
          type: connectionInfo?.type,
          url: connectionInfo?.url,
          note: "For Streamable HTTP connections, add this URL directly in your MCP Client",
        };
    }
  }, [connectionInfo]);

  const handleCopyServerEntry = (event: BaseSyntheticEvent) => {
    if ("key" in event && event.key !== "Enter") return;
    copyToClipboard(JSON.stringify(serverEntry, null, 2));
    toast.success("Copied server entry to clipboard");
  };

  const handleCopyServerFile = (event: BaseSyntheticEvent) => {
    if ("key" in event && event.key !== "Enter") return;
    const fileContent = {
      mcpServers: {
        "default-server": serverEntry,
      },
    };
    copyToClipboard(JSON.stringify(fileContent, null, 2));
    toast.success("Copied servers file to clipboard");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-max has-[>svg]:px-1 px-1 py-1 data-[state=open]:bg-accent dark:data-[state=open]:bg-accent/50"
        >
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start">
        <DropdownMenuItem
          onClick={handleDisconnect}
          onKeyDown={handleDisconnect}
        >
          <Unplug />
          Disconnect Server
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleCopyServerEntry}
          onKeyDown={handleCopyServerEntry}
        >
          <Copy />
          Copy Server Entry
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleCopyServerFile}
          onKeyDown={handleCopyServerFile}
        >
          <Copy />
          Copy Servers File
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ReconnectButton() {
  const { connect } = useConnection();

  const handleConnect = eventHandler(() => connect());

  return (
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
  );
}
