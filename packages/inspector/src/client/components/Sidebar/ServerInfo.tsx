import { Transport } from "@muppet-kit/shared";
import { Copy, Ellipsis, RotateCcw, Unplug, X } from "lucide-react";
import {
  type BaseSyntheticEvent,
  type PropsWithChildren,
  useMemo,
  useState,
} from "react";
import { eventHandler } from "../../lib/eventHandler";
import { cn } from "../../lib/utils";
import { useConfig, useConnection } from "../../providers";
import {
  type ConnectionInfo,
  ConnectionStatus,
} from "../../providers/connection/manager";
import { CodeHighlighter } from "../Hightlighter";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent } from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useSidebar } from "../ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

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
    <div className="p-2 flex rounded-md gap-1 flex-col w-full border bg-background dark:bg-background/50">
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
  const [isOpenCopyDialog, setOpenCopyDialog] = useState(false);

  const handleDisconnect = (event: BaseSyntheticEvent) => {
    if ("key" in event && event.key !== "Enter") return;
    disconnect();
  };

  const handleShowCopyDialog = (event: BaseSyntheticEvent) => {
    if ("key" in event && event.key !== "Enter") return;
    setOpenCopyDialog(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-max has-[>svg]:px-1 px-1 py-1 data-[state=open]:bg-accent dark:data-[state=open]:bg-accent/50 data-[state=open]:text-accent-foreground rounded-sm"
          >
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start">
          <DropdownMenuItem
            onClick={handleShowCopyDialog}
            onKeyDown={handleShowCopyDialog}
          >
            <Copy />
            Copy Server Config
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDisconnect}
            onKeyDown={handleDisconnect}
          >
            <Unplug />
            Disconnect Server
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ServerConfigDialog
        open={isOpenCopyDialog}
        onOpenChange={setOpenCopyDialog}
      />
    </>
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

type ServerConfigDialog = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function ServerConfigDialog(props: ServerConfigDialog) {
  const { connectionInfo } = useConfig();
  const [tabValue, setTabValue] = useState("entery");

  const content = useMemo(() => {
    if (!connectionInfo) return "";

    const serverConfig = convertToServerConfig(connectionInfo);

    let content: Record<string, unknown> = serverConfig;
    if (tabValue === "file") {
      content = {
        mcpServers: {
          "default-server": content,
        },
      };
    } else if (tabValue === "mcp-remote") {
      content = {
        command: "npx",
        args: [
          "mcp-remote",
          serverConfig.url,
          `--transport ${
            serverConfig.type === Transport.HTTP ? "http-only" : "sse-only"
          }`,
        ],
      };
    }

    return JSON.stringify(content, null, 2);
  }, [connectionInfo, tabValue]);

  return (
    <Dialog {...props}>
      <DialogContent isClosable={false} className="sm:max-w-3xl h-[400px]">
        <div className="size-full overflow-auto">
          <Tabs
            value={tabValue}
            onValueChange={setTabValue}
            defaultValue="entery"
            className="w-full h-full gap-4"
          >
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger
                  value="entery"
                  className="data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-primary cursor-pointer py-2 px-2 xl:px-5 dark:data-[state=active]:bg-foreground dark:data-[state=active]:text-background"
                >
                  Server Entery
                </TabsTrigger>
                <TabsTrigger
                  value="file"
                  className="data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-primary cursor-pointer py-2 px-2 xl:px-5 dark:data-[state=active]:bg-foreground dark:data-[state=active]:text-background"
                >
                  Server File
                </TabsTrigger>
                {connectionInfo?.type !== Transport.STDIO && (
                  <TabsTrigger
                    value="mcp-remote"
                    className="data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-primary cursor-pointer py-2 px-2 xl:px-5 dark:data-[state=active]:bg-foreground dark:data-[state=active]:text-background"
                  >
                    mcp-remote
                  </TabsTrigger>
                )}
              </TabsList>
              <div className="flex-1" />
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  className="size-max has-[>svg]:px-1.5 py-1.5"
                >
                  <X />
                </Button>
              </DialogClose>
            </div>
            <CodeHighlighter content={content} />
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function convertToServerConfig(connectionInfo: ConnectionInfo) {
  switch (connectionInfo.type) {
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
}
