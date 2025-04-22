import { useConnection } from "@/providers";
import { EmptyResultSchema } from "@modelcontextprotocol/sdk/types.js";
import { Bell } from "lucide-react";
import { SidebarMenuButton } from "./ui/sidebar";

export function PingButton() {
  const { makeRequest, connectionStatus } = useConnection();

  const onPing = () =>
    makeRequest(
      {
        method: "ping" as const,
      },
      EmptyResultSchema
    );

  if (connectionStatus === "disconnected") return;

  return (
    <SidebarMenuButton
      onClick={onPing}
      onKeyDown={onPing}
      disabled={connectionStatus === "error"}
    >
      <Bell />
      Ping Server
    </SidebarMenuButton>
  );
}
