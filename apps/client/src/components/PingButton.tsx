import { useConnection } from "@/providers";
import { Bell } from "lucide-react";
import { SidebarMenuButton } from "./ui/sidebar";

export function PingButton() {
  const { mcpClient, connectionStatus } = useConnection();

  // TODO: Add a loading state
  const onPing = () => mcpClient?.ping();

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
