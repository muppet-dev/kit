import { EmptyResultSchema } from "@modelcontextprotocol/sdk/types.js";
import { Bell } from "lucide-react";
import { useState } from "react";
import { eventHandler } from "../../../lib/eventHandler";
import { useConnection } from "../../../providers";
import { ConnectionStatus } from "../../../providers/connection/manager";
import { SidebarMenuButton, SidebarMenuItem } from "../../ui/sidebar";
import { Spinner } from "../../ui/spinner";
import { OptionsMenu } from "./OptionsMenu";

export function PingButton() {
  // Show this loading state when the server is pinging
  const [isLoading, setIsLoading] = useState(false);
  const { makeRequest, connectionStatus } = useConnection();

  const handlePingServer = eventHandler(async () => {
    setIsLoading(true);
    await makeRequest(
      {
        method: "ping",
      },
      EmptyResultSchema,
    );
    setIsLoading(false);
  });

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={handlePingServer}
        onKeyDown={handlePingServer}
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
      <OptionsMenu />
    </SidebarMenuItem>
  );
}
