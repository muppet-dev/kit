import { ListX, Logs, Pickaxe, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "../../components/ui/dialog";
import { DropdownMenuItem } from "../../components/ui/dropdown-menu";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { eventHandler } from "../../lib/eventHandler";
import { useConfig, useConnection, useTracing } from "../../providers";
import { DownloadButton } from "./DownloadButton";
import { ServerOptionMenu } from "./ServerOptionMenu";
import { TracingTable } from "./Table";
import { LogsProvider } from "./providers";

export default function TracingPage() {
  const { config, isTracingEnabled } = useConfig();

  return (
    <LogsProvider>
      <div className="p-4 size-full flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Logs className="size-5" />
          <h2 className="text-2xl font-bold">Traces</h2>
          <div className="flex-1" />
          <PageHeader />
        </div>
        {isTracingEnabled ? (
          <div className="size-full flex-1 flex flex-col gap-4 overflow-y-auto">
            <TracingTable />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center size-full text-center">
            <p className="text-muted-foreground">
              Tracing is not enabled for the current runtime ({config?.runtime}
              ).
              <br />
              Please check your configuration or refer to the documentation for
              more details.
            </p>
          </div>
        )}
      </div>
    </LogsProvider>
  );
}

function PageHeader() {
  const { clearTraces } = useTracing();
  const { isTracingEnabled } = useConfig();

  if (!isTracingEnabled) return <></>;

  const onClear = eventHandler(() => clearTraces());

  return (
    <div className="flex items-center gap-2">
      <TunnelLinkButton />
      <DownloadButton />
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

function TunnelLinkButton() {
  const [isTunnelDialogOpen, setTunnelDialogOpen] = useState(false);

  const handleOpenDialog = eventHandler(() => setTunnelDialogOpen(true));

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className="has-[>svg]:px-1.5 py-1.5 h-max rounded-sm data-[state=open]:bg-accent dark:data-[state=open]:bg-accent/50"
            onClick={handleOpenDialog}
            onKeyDown={handleOpenDialog}
          >
            <Pickaxe className="stroke-secondary-foreground/80" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Create a tunnel</TooltipContent>
      </Tooltip>
      <Dialog open={isTunnelDialogOpen} onOpenChange={setTunnelDialogOpen}>
        <DialogOverlay />
        <DialogContent className="flex flex-col">
          <DialogHeader>
            <DialogTitle>Proxy URL</DialogTitle>
            <DialogDescription>
              Add this URL to the MCP Client to connect the inspector as a
              proxy.
            </DialogDescription>
          </DialogHeader>
          <LocalContentRender />
          <PublicContentRender />
        </DialogContent>
      </Dialog>
    </>
  );
}

function LocalContentRender() {
  const { token } = useConnection();
  const { connectionLink } = useConfig();

  const authorization = token != null ? `&authorization=${token}` : "";
  const url = `${connectionLink?.url?.toString()}${authorization}`;

  return (
    <div className="w-full">
      <Label className="mb-1.5">Local URL</Label>
      <div className="w-full flex items-center gap-2">
        <Input readOnly value={url} className="w-full h-max" />
        <ServerOptionMenu url={url} />
      </div>
    </div>
  );
}

function PublicContentRender() {
  const { token } = useConnection();
  const { createLink, isTunnelingEnabled } = useConfig();

  if (!isTunnelingEnabled) return <></>;

  if (createLink.isPending) return <Skeleton className="h-[30px] rounded-md" />;

  const data = createLink.data;

  const authorization = token != null ? `&authorization=${token}` : "";
  const url = `${data?.url?.toString()}${authorization}`;

  const handleGeneratePublicURL = eventHandler(() => createLink.mutateAsync());

  return (
    <div className="w-full">
      <Label className="mb-1.5">Public URL</Label>
      {data ? (
        <div className="w-full flex items-center gap-2">
          <Input readOnly value={url} className="w-full h-max" />
          <ServerOptionMenu url={url}>
            <DropdownMenuItem
              onClick={handleGeneratePublicURL}
              onKeyDown={handleGeneratePublicURL}
            >
              <RefreshCcw />
              Re-Generate
            </DropdownMenuItem>
          </ServerOptionMenu>
        </div>
      ) : (
        <Button
          onClick={handleGeneratePublicURL}
          onKeyDown={handleGeneratePublicURL}
          className="h-max py-[5px] px-2"
        >
          Generate URL
        </Button>
      )}
    </div>
  );
}
