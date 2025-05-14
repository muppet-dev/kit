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
import {
  History,
  Logs,
  PieChart,
  Settings2,
  Shield,
  SquareTerminal,
} from "lucide-react";
import { Link } from "react-router";
import { ThemeSelector } from "../ThemeSelector";
import { ConnectStatus } from "./ConnectStatus";
import { PingButton } from "./PingButton";
import { SidebarItem } from "./SidebarItem";

const data = {
  navPlayground: [
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
  ],
  projects: [
    {
      name: "Settings",
      url: "/settings",
      icon: Settings2,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
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
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <ConnectStatus />
            <PingButton />
          </SidebarMenu>
        </SidebarGroup>
        <SidebarItem items={data.navPlayground} />
        <SidebarItem items={data.projects} />
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
