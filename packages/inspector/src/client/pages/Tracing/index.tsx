import { CopyButton } from "@/client/components/CopyButton";
import { Button } from "@/client/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/client/components/ui/dropdown-menu";
import { Input } from "@/client/components/ui/input";
import { Skeleton } from "@/client/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/client/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/client/components/ui/tooltip";
import { eventHandler } from "@/client/lib/eventHandler";
import { useConfig, useConnection, useNotification } from "@/client/providers";
import { ListX, Pickaxe } from "lucide-react";
import { TracingTable } from "./Table";
import { TraceTab, TracingProvider, useTracing } from "./providers";

export default function TracingPage() {
  return (
    <TracingProvider>
      <TracingPanel />
    </TracingProvider>
  );
}

function TracingPanel() {
  const { tab, changeTab } = useTracing();

  return (
    <div className="p-4 size-full">
      <Tabs
        value={tab.value}
        onValueChange={(value) => changeTab(value as TraceTab)}
        className="size-full"
      >
        <div className="flex items-center justify-between gap-2">
          <TabsList>
            <TabsTrigger
              value={TraceTab.TRACES}
              className="data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-primary cursor-pointer py-2 px-5 dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
            >
              Traces
            </TabsTrigger>
            <TabsTrigger
              value={TraceTab.NOTIFICATIONS}
              className="data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-primary cursor-pointer py-2 px-5 dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
            >
              Notifications
            </TabsTrigger>
            <TabsTrigger
              value={TraceTab.ERRORS}
              className="data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-primary cursor-pointer py-2 px-5 dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
            >
              Errors
            </TabsTrigger>
          </TabsList>
          <PageHeader />
        </div>
        <div className="size-full flex flex-col gap-4 overflow-y-auto">
          <TracingTable />
        </div>
      </Tabs>
    </div>
  );
}

function PageHeader() {
  const { tab } = useTracing();
  const { clearNotifications, clearStdErrNotifications } = useNotification();
  const { setRequestHistory } = useConnection();

  const onClear = eventHandler(() => {
    switch (tab.value) {
      case TraceTab.TRACES:
        setRequestHistory([]);
        break;
      case TraceTab.NOTIFICATIONS:
        clearNotifications();
        break;
      case TraceTab.ERRORS:
        clearStdErrNotifications();
        break;
    }
  });

  return (
    <div className="flex items-center gap-2">
      <TunnelLink />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="size-max has-[>svg]:px-1.5 py-1.5"
            onClick={onClear}
            onKeyDown={onClear}
          >
            <ListX className="size-4 stroke-2" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Clear all traces</TooltipContent>
      </Tooltip>
    </div>
  );
}

function TunnelLink() {
  const { isTunnelingEnabled, createLink } = useConfig();

  const handler = (linkType: "local" | "public") =>
    eventHandler(() => createLink.mutateAsync(linkType));

  return (
    <>
      {createLink.isPending ? (
        <Skeleton className="h-[30px] w-[300px]" />
      ) : (
        createLink.data && (
          <div className="w-[300px] flex relative items-center">
            <Input
              readOnly
              value={createLink.data?.url}
              placeholder=""
              className="w-full h-max pr-8"
            />
            <CopyButton
              data={createLink.data?.url}
              tooltipContent="Copy URL"
              disabled={createLink.isPending}
              className="absolute right-0"
            />
          </div>
        )
      )}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="has-[>svg]:px-1.5 py-1.5 h-max rounded-sm data-[state=open]:bg-accent dark:data-[state=open]:bg-accent/50"
              >
                <Pickaxe className="size-[18px] stroke-zinc-600 dark:stroke-zinc-300" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Create a tunnel</TooltipContent>
          </Tooltip>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            disabled={createLink.isPending}
            onClick={handler("local")}
            onKeyDown={handler("local")}
          >
            Local Tunnel
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isTunnelingEnabled || createLink.isPending}
            onClick={handler("public")}
            onKeyDown={handler("public")}
          >
            Public Tunnel
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
