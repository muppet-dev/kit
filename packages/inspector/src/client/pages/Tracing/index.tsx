import { CopyButton } from "@/client/components/CopyButton";
import { Button } from "@/client/components/ui/button";
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
import { getMCPProxyAddress } from "@/client/providers/connection/manager";
import { useMutation } from "@tanstack/react-query";
import { ListX, Pickaxe, RefreshCcw } from "lucide-react";
import toast from "react-hot-toast";
import { TraceTab, TracingProvider, useTracing } from "./providers";
import { TracingTable } from "./Table";

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
  const { config } = useConfig();
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
      {config?.tunneling && <TunnelLink />}
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
  const mutation = useMutation({
    mutationFn: () =>
      fetch(`${getMCPProxyAddress()}/tunnel`).then((res) => {
        if (!res.ok) {
          throw new Error(
            "Failed to generate a new tunneling URL. Please try again.",
          );
        }

        return res.json() as Promise<{ id: string; url: string }>;
      }),
    onError: (err) => {
      toast.error(err.message);
      console.error(err);
    },
  });

  const handleFetch = eventHandler(() => mutation.mutateAsync());

  const FetchIcon = mutation.data ? RefreshCcw : Pickaxe;

  return (
    <>
      {mutation.isPending ? (
        <Skeleton className="h-[30px] w-[300px]" />
      ) : (
        mutation.data && (
          <div className="w-[300px] flex relative items-center">
            <Input
              readOnly
              value={mutation.data?.url}
              placeholder=""
              className="w-full h-max pr-8"
            />
            <CopyButton
              data={mutation.data?.url}
              tooltipContent="Copy URL"
              disabled={mutation.isPending}
              className="absolute right-0"
            />
          </div>
        )
      )}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            aria-label="copy"
            variant="ghost"
            className="size-max has-[>svg]:px-1.5 py-1.5"
            disabled={mutation.isPending}
            onClick={handleFetch}
            onKeyDown={handleFetch}
          >
            <FetchIcon className="size-4 stroke-2" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {mutation.data ? "Create a new URL" : "Generate a tunneling URL"}
        </TooltipContent>
      </Tooltip>
    </>
  );
}
