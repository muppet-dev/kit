import { NavPlayground } from "@/components/nav-playground";
import { NavProjects } from "@/components/nav-projects";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import Logo from "@/public/logo.png";
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
          title: "Scanner",
          url: "/playground/scanner",
          name: "scanner",
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
      <SidebarHeader>
        <Link to="/">
          <img src={Logo} alt="" className={open ? "size-10" : "size-8"} />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavPlayground items={data.navPlayground} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarTrigger />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
