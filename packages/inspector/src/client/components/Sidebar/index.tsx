import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/client/components/ui/sidebar";
import { cn } from "@/client/lib/utils";
import { useConfig, useConnection } from "@/client/providers";
import {
  FolderTree,
  History,
  Logs,
  Settings2,
  Shield,
  SquareTerminal,
} from "lucide-react";
import { Link } from "react-router";
import { ThemeSelector } from "../ThemeSelector";
import { Badge } from "../ui/badge";
import { ConnectStatus } from "./ConnectStatus";
import { PingButton } from "./PingButton";
import { SidebarItem } from "./SidebarItem";

const data = {
  panels: [
    {
      name: "Explorer",
      url: "/explorer",
      icon: SquareTerminal,
    },
    {
      name: "MCP Scan",
      url: "/mcp-scan",
      icon: Shield,
    },
    // {
    //   name: "Playground",
    //   url: "/playground",
    //   icon: PieChart,
    // },
    {
      name: "Tracing",
      url: "/tracing",
      icon: Logs,
    },
    {
      name: "History",
      url: "/history",
      icon: History,
    },
    {
      name: "Roots",
      url: "/roots",
      icon: FolderTree,
    },
  ],
  configuration: [
    {
      name: "Settings",
      url: "/settings",
      icon: Settings2,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar();
  const { version } = useConfig();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex-row items-center justify-between">
        <Link to="/" className="w-max">
          <img
            src={open ? "/logo.png" : "/logo-small.png"}
            alt="Muppet"
            className={cn("dark:hidden", open ? "w-32" : "size-8")}
          />
          <img
            src={open ? "/logo-dark.png" : "/logo-small-dark.png"}
            alt="Muppet"
            className={cn("dark:block hidden", open ? "w-32" : "size-8")}
          />
        </Link>
        {open && <Badge>v{version}</Badge>}
      </SidebarHeader>
      <SidebarContent>
        <ServerInfoSection />
        <SidebarGroup>
          <SidebarMenu>
            <PingButton />
          </SidebarMenu>
        </SidebarGroup>
        <SidebarItem items={data.panels} />
        <SidebarItem items={data.configuration} />
      </SidebarContent>
      <SidebarFooter
        className={cn(open && "flex-row items-center justify-between")}
      >
        <SidebarTrigger />
        <ThemeSelector />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function ServerInfoSection() {
  const { mcpClient, connectionStatus } = useConnection();
  const { open } = useSidebar();

  const serverInfo = mcpClient?.getServerVersion();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {open ? (
          <div className="p-2 flex gap-1 flex-col w-full border bg-background dark:bg-background/50">
            {connectionStatus === "connected" ? (
              <div className="pl-1 flex justify-between items-center text-sm select-none">
                <p className="font-semibold">{serverInfo?.name}</p>
                <p className="text-muted-foreground">v{serverInfo?.version}</p>
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground select-none">
                No Server
              </p>
            )}
            <ConnectStatus />
          </div>
        ) : (
          <ConnectStatus />
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
