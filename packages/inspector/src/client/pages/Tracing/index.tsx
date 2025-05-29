import { ServerOptionMenu } from "@/client/components/ServerOptionMenu";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { Copy, ListX, Logs, Pickaxe, RefreshCcw } from "lucide-react";
import { type BaseSyntheticEvent, useState } from "react";
import toast from "react-hot-toast";
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
import { LogsProvider } from "./providers";
import { TracingTable } from "./Table";

export default function TracingPage() {
  return (
    <LogsProvider>
      <div className="p-4 size-full flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Logs className="size-5" />
          <h2 className="text-2xl font-bold">Traces</h2>
          <div className="flex-1" />
          <PageHeader />
        </div>
        <div className="size-full flex-1 flex flex-col gap-4 overflow-y-auto">
          <TracingTable />
        </div>
      </div>
    </LogsProvider>
  );
}

function PageHeader() {
  const { clearTraces } = useTracing();

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
      {isTunnelDialogOpen && (
        <TunnelInformationDialog
          open={isTunnelDialogOpen}
          onOpenChange={setTunnelDialogOpen}
        />
      )}
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
    </>
  );
}

type TunnelInformationDialog = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function TunnelInformationDialog(props: TunnelInformationDialog) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogOverlay />
      <DialogContent className="flex flex-col">
        <DialogHeader>
          <DialogTitle>Proxy URL</DialogTitle>
          <DialogDescription>
            Add this URL to the MCP Client to connect the inspector as a proxy.
          </DialogDescription>
        </DialogHeader>
        <LocalContentRender />
        <PublicContentRender />
      </DialogContent>
    </Dialog>
  );
}

function LocalContentRender() {
  const { token } = useConnection();
  const { connectionLink } = useConfig();
  const [_, copyToClipboard] = useCopyToClipboard();

  const authorization = token ? `&authorization=${token}` : "";
  const content = `${connectionLink?.url?.toString()}${authorization}`;

  const handleCopyURL = (event: BaseSyntheticEvent) => {
    if ("key" in event && event.key !== "Enter") return;

    copyToClipboard(JSON.stringify(content, null, 2));
    toast.success("Copied tunnel URL to clipboard");
  };

  return (
    <div className="w-full">
      <Label className="mb-1.5">Local URL</Label>
      <div className="w-full flex items-center gap-2">
        <Input readOnly value={content} className="w-full h-max" />
        <ServerOptionMenu>
          <DropdownMenuItem onClick={handleCopyURL} onKeyDown={handleCopyURL}>
            <Copy />
            Copy URL
          </DropdownMenuItem>
        </ServerOptionMenu>
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
  const content = `${data?.url?.toString()}&authorization=${token}`;

  const handleGeneratePublicURL = eventHandler(() => createLink.mutateAsync());

  return (
    <div className="w-full">
      <Label className="mb-1.5">Public URL</Label>
      {data ? (
        <div className="w-full flex items-center gap-2">
          <Input readOnly value={content} className="w-full h-max" />
          <ServerOptionMenu>
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
