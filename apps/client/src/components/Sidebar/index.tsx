import { NavPlayground } from "@/components/nav-playground";
import { NavProjects } from "@/components/nav-projects";
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
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import MuppetDarkLogo from "@/public/logo-dark.png";
import Logo from "@/public/logo.png";
import { Frame, PieChart, Settings2, SquareTerminal } from "lucide-react";
import { Link } from "react-router";
import { ConnectStatus } from "../ConnectStatus";
import { PingButton } from "../PingButton";
import { ThemeSelector } from "../ThemeSelector";

const data = {
  navPlayground: [
    {
      name: "Explorer",
      url: "/explorer",
      icon: SquareTerminal,
    },
    {
      name: "LLM Scoring",
      url: "/llm-scoring",
      icon: PieChart,
    },
  ],
  projects: [
    {
      name: "Tracing",
      url: "/tracing",
      icon: Frame,
    },
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
            src={Logo}
            alt="Muppet"
            className={open ? "dark:hidden w-32" : "hidden"}
          />
          <img
            src={MuppetDarkLogo}
            alt="Muppet"
            className={open ? "dark:block hidden w-32" : "hidden"}
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
        <NavPlayground items={data.navPlayground} />
        <NavProjects projects={data.projects} />
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
