import { eventHandler } from "@/client/lib/eventHandler";
import { ConnectionStatus } from "@/client/providers/connection/manager";
import {
  type LoggingLevel,
  LoggingLevelSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
  BookText,
  Bot,
  Check,
  ChevronRight,
  ExternalLink,
  History,
  Logs,
  ScrollText,
  Settings,
  Settings2,
  Shapes,
  Shield,
  SquareTerminal,
} from "lucide-react";
import { type BaseSyntheticEvent, useState } from "react";
import { Link } from "react-router";
import z from "zod";
import { cn } from "../../lib/utils";
import { useConfig, useConnection } from "../../providers";
import { Logo } from "../Logo";
import { LogoSmall } from "../LogoSmall";
import { PreferencesDialog } from "../PreferencesDialog";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "../ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { PingButton } from "./PingButton";
import { ServerInfo } from "./ServerInfo";
import { SidebarItem } from "./SidebarItem";
import { VersionBanner } from "./VersionBanner";

const SIDEBAR_ITEMS = {
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
    {
      name: "Playground",
      url: "/playground",
      icon: Bot,
    },
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
        <Link to="/" className={cn("w-max", open ? "py-0.5" : "py-1.5")}>
          {open ? (
            <Logo className="w-28" />
          ) : (
            <LogoSmall className="h-[15.53px] w-max" />
          )}
        </Link>
        {open && (
          <p className="text-sm font-semibold text-muted-foreground">
            v{version}
          </p>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <ServerInfo />
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarMenu>
            <PingButton />
            <LogingLevel />
          </SidebarMenu>
        </SidebarGroup>
        <SidebarItem items={SIDEBAR_ITEMS.panels} />
        <SidebarItem items={SIDEBAR_ITEMS.configuration} />
        <div className="flex-1" />
        <VersionBanner />
      </SidebarContent>
      <SidebarFooter className={cn(open && "flex-row items-center")}>
        <GithubLinkButton />
        <DocumentationLinkButton />
        <PreferencesDialogTrigger />
        {open && <div className="flex-1" />}
        <SidebarTrigger />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function LogingLevel() {
  const { serverCapabilities, connectionStatus, makeRequest } = useConnection();
  const [logLevel, setLogLevel] = useState<LoggingLevel>("debug");

  const loggingSupported =
    serverCapabilities && "logging" in serverCapabilities;

  const sendLogLevelRequest =
    (level: LoggingLevel) => async (event: BaseSyntheticEvent) => {
      if ("key" in event && event.key !== "Enter") return;

      if (level !== logLevel)
        await makeRequest(
          {
            method: "logging/setLevel" as const,
            params: { level },
          },
          z.object({}),
        );
      setLogLevel(level);
    };

  if (!loggingSupported || connectionStatus !== ConnectionStatus.CONNECTED)
    return <></>;

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            tooltip={`Log Level - ${logLevel}`}
            className="group/log data-[active=true]:font-normal data-[state=open]:[&>div>svg]:visible data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <ScrollText />
            Log Level
            <div className="flex-1" />
            <div className="flex items-center gap-1">
              <ChevronRight className="size-4 group-hover/log:visible invisible transition-all ease-in-out text-muted-foreground" />
              <p className="text-muted-foreground italic">{logLevel}</p>
            </div>
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start">
          {Object.values(LoggingLevelSchema.enum).map((level) => (
            <DropdownMenuItem
              key={level}
              onClick={sendLogLevelRequest(level)}
              onKeyDown={sendLogLevelRequest(level)}
            >
              {level}
              {logLevel === level && <Check className="size-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function PreferencesDialogTrigger() {
  const [isOpenPreferenceDialog, setOpenPreferenceDialog] = useState(false);

  const handleOpenPreferenceDialog = eventHandler(() =>
    setOpenPreferenceDialog(true),
  );

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className="size-8"
            onClick={handleOpenPreferenceDialog}
            onKeyDown={handleOpenPreferenceDialog}
          >
            <Settings />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Preferences</TooltipContent>
      </Tooltip>
      <PreferencesDialog
        open={isOpenPreferenceDialog}
        onOpenChange={setOpenPreferenceDialog}
      />
    </>
  );
}

function GithubLinkButton() {
  const { state } = useSidebar();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href="https://github.com/muppet-dev/kit"
          target="_blank"
          rel="noreferrer"
        >
          <Button
            variant="ghost"
            className="size-8 [&>svg]:fill-foreground hover:[&>svg]:fill-accent-foreground"
          >
            <GithubIcon />
          </Button>
        </a>
      </TooltipTrigger>
      <TooltipContent side={state === "collapsed" ? "right" : "top"}>
        Github
      </TooltipContent>
    </Tooltip>
  );
}

function GithubIcon() {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="size-4"
    >
      <title>GitHub</title>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function DocumentationLinkButton() {
  const { state } = useSidebar();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-8">
              <BookText />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            <a
              href="https://www.muppet.dev/docs"
              target="_blank"
              rel="noreferrer"
            >
              <DropdownMenuItem>
                <ExternalLink />
                Documentation
              </DropdownMenuItem>
            </a>
            <a href="/openapi.json" target="_blank" rel="noreferrer">
              <DropdownMenuItem>
                <Shapes />
                OpenAPI Docs
              </DropdownMenuItem>
            </a>
          </DropdownMenuContent>
        </DropdownMenu>
      </TooltipTrigger>
      <TooltipContent side={state === "collapsed" ? "right" : "top"}>
        Documentation
      </TooltipContent>
    </Tooltip>
  );
}
