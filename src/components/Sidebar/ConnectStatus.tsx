import { cn } from "@/lib/utils";
import { useConnection } from "@/providers";
import { Dot } from "lucide-react";
import { SidebarMenuButton } from "../ui/sidebar";

export function ConnectStatus() {
  const { connectionStatus } = useConnection();

  const tilte =
    connectionStatus === "connected"
      ? "Connected"
      : connectionStatus === "error"
        ? "Connection Error"
        : "Disconnected";

  return (
    <SidebarMenuButton
      className="hover:bg-transparent active:bg-transparent"
      tooltip={tilte}
    >
      <Dot
        className={cn(
          "!size-2.5 rounded-full ml-0.5",
          connectionStatus === "connected"
            ? "bg-green-500 text-green-500"
            : connectionStatus === "error"
              ? "bg-red-500 text-red-500"
              : "bg-gray-500 text-gray-500",
        )}
      />
      <span className="text-sm">{tilte}</span>
    </SidebarMenuButton>
  );
}
