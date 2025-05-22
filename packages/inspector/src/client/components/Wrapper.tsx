import { RotateCcw, Unplug, XCircle } from "lucide-react";
import type { PropsWithChildren } from "react";
import { Outlet, useLocation } from "react-router";
import { eventHandler } from "../lib/eventHandler";
import { useConnection } from "../providers";
import { ConnectionStatus } from "../providers/connection/manager";
import { AppSidebar } from "./Sidebar";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

export function AppWrapper() {
  return (
    <>
      <AppSidebar />
      <ConnectionWrapper>
        <Outlet />
      </ConnectionWrapper>
    </>
  );
}

function ConnectionWrapper(props: PropsWithChildren) {
  const { connectionStatus } = useConnection();
  const { pathname } = useLocation();

  if (pathname.includes("settings")) return props.children;

  if (connectionStatus === ConnectionStatus.CONNECTING)
    return (
      <div className="flex items-center justify-center gap-1.5 size-full select-none text-muted-foreground">
        <Spinner className="size-5 min-w-5 min-h-5" />
        <p className="text-sm">Connecting to MCP server...</p>
      </div>
    );

  if (connectionStatus === ConnectionStatus.DISCONNECTED)
    return (
      <div className="flex flex-col items-center justify-center gap-2 size-full select-none text-muted-foreground">
        <Unplug className="size-14" />
        <p className="text-xl font-medium">Server Disconnected</p>
        <ReconnectButton />
      </div>
    );

  if (
    connectionStatus === ConnectionStatus.ERROR ||
    connectionStatus === ConnectionStatus.ERROR_CONNECTING_TO_PROXY
  )
    return (
      <div className="flex flex-col items-center justify-center gap-2 size-full select-none text-destructive">
        <XCircle className="size-14" />
        <p className="text-xl font-medium">Error Connecting Server</p>
      </div>
    );

  return props.children;
}

function ReconnectButton() {
  const { connect } = useConnection();

  const handleConnect = eventHandler(() => connect());

  return (
    <Button
      colorScheme="secondary"
      className="text-base mt-6 py-2.5"
      onClick={handleConnect}
      onKeyDown={handleConnect}
    >
      <RotateCcw className="size-4" />
      Reconnect
    </Button>
  );
}
