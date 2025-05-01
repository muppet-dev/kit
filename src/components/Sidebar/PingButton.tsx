import { useConnection } from "@/providers";
import { ConnectionStatus } from "@/providers/connection/manager";
import { EmptyResultSchema } from "@modelcontextprotocol/sdk/types.js";
import { Bell } from "lucide-react";
import { useState } from "react";
import { SidebarMenuButton } from "../ui/sidebar";
import { Spinner } from "../ui/spinner";

export function PingButton() {
  // Show this loading state when the server is pinging
  const [isLoading, setIsLoading] = useState(false);
  const { makeRequest, connectionStatus } = useConnection();

  return (
    <SidebarMenuButton
      onClick={async () => {
        setIsLoading(true);
        await makeRequest(
          {
            method: "ping",
          },
          EmptyResultSchema,
        );
        setIsLoading(false);
      }}
      onKeyDown={async (event) => {
        if (event.key === "Enter") {
          setIsLoading(true);
          await makeRequest(
            {
              method: "ping",
            },
            EmptyResultSchema,
          );
          setIsLoading(false);
        }
      }}
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
