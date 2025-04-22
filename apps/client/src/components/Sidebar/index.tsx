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
import Logo from "@/public/logo.png";
import MuppetDarkLogo from "@/public/logo-dark.png";

import {
  AudioWaveform,
  Command,
  Frame,
  GalleryVerticalEnd,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";
import { Link } from "react-router";
import { ConnectStatus } from "../ConnectStatus";
import { PingButton } from "../PingButton";
import { ThemeSelector } from "../ThemeSelector";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navPlayground: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      className: "text-sidebar-foreground",
      items: [
        {
          title: "Explorer",
          url: "/playground/explorer",
          name: "explorer",
          isActive: true,
        },
        {
          title: "LLM Scoring",
          url: "/playground/llm-scoring",
          name: "llm-scoring",
          icon: PieChart,
        },
      ],
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
      <SidebarHeader
        className={cn(open ? "flex-row justify-between" : "relative")}
      >
        <Link to="/">
          <img
            src={Logo}
            alt="Muppet"
            className={cn(open ? "size-10" : "size-8", "dark:hidden")}
          />
          <img
            src={MuppetDarkLogo}
            alt="Muppet"
            className={cn(open ? "size-10" : "size-8", "dark:block hidden")}
          />
        </Link>
        <ConnectStatus />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="flex-row justify-between">
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
