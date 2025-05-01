import { useConnection } from "@/providers";
import { Bell } from "lucide-react";
import { SidebarMenuButton } from "./ui/sidebar";
import { useState } from "react";
import { ConnectionStatus } from "@/hooks/use-connection";
import { Spinner } from "./ui/spinner";

export function PingButton() {
  // Show this loading state when the server is pinging
  const [isLoading, setIsLoading] = useState(false);
  const { mcpClient, connectionStatus } = useConnection();

  const onPing = async () => {
    setIsLoading(true);
    await mcpClient?.ping();
    setIsLoading(false);
  };

  return (
    <SidebarMenuButton
      onClick={onPing}
      onKeyDown={onPing}
      disabled={connectionStatus !== ConnectionStatus.CONNECTED || isLoading}
      tooltip="Ping Server"
    >
      <Bell />
      Ping Server
      {isLoading && (
        <>
          <div className="flex-1" />
          <Spinner className="size-4 min-w-4 min-h-4" />
        </>
      )}
    </SidebarMenuButton>
  );
}
