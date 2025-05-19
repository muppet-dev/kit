import { CopyButton } from "../../components/CopyButton";
import { CodeHighlighter } from "../../components/Hightlighter";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { eventHandler } from "../../lib/eventHandler";
import { useConfig } from "../../providers";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { ListX, Logs, Pickaxe } from "lucide-react";
import type { BaseSyntheticEvent } from "react";
import { DownloadButton } from "./DownloadButton";
import { TracingTable } from "./Table";
import { LogsProvider } from "./providers";

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
  // TODO: Please update this function
  const onClear = eventHandler(() => {
    console.log("Clear logs");
  });

  return (
    <div className="flex items-center gap-2">
      <TunnelLink />
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

function TunnelLink() {
  const { isTunnelingEnabled, createLink } = useConfig();

  const handleCreateLink =
    (linkType: "local" | "public") => (event: BaseSyntheticEvent) => {
      if ("key" in event && event.key !== "Enter") return;

      createLink.mutateAsync(linkType);
    };

  return (
    <>
      {createLink.isPending ? (
        <Skeleton className="h-[30px] w-[300px]" />
      ) : (
        createLink.data && <TunnelInformationDialog {...createLink.data} />
      )}
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="has-[>svg]:px-1.5 py-1.5 h-max rounded-sm data-[state=open]:bg-accent dark:data-[state=open]:bg-accent/50"
                >
                  <Pickaxe className="stroke-zinc-600 dark:stroke-zinc-300" />
                </Button>
              </DropdownMenuTrigger>
            </div>
          </TooltipTrigger>
          <TooltipContent>Create a tunnel</TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            disabled={createLink.isPending}
            onClick={handleCreateLink("local")}
            onKeyDown={handleCreateLink("local")}
          >
            Local Tunnel
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!isTunnelingEnabled || createLink.isPending}
            onClick={handleCreateLink("public")}
            onKeyDown={handleCreateLink("public")}
          >
            Public Tunnel
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

function TunnelInformationDialog(props: {
  id: string;
  url: URL;
  headers: HeadersInit;
}) {
  const headers = Object.fromEntries(new Headers(props.headers).entries());

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="max-w-[300px] py-1.5">
          <p className="truncate w-full">{props.url.toString()}</p>
        </Button>
      </DialogTrigger>
      <DialogOverlay />
      <DialogContent className="flex flex-col">
        <DialogHeader>
          <DialogTitle>Generated Information</DialogTitle>
          <DialogDescription>
            Your URL and headers are ready to use
          </DialogDescription>
        </DialogHeader>
        <div className="w-full">
          <Label className="mb-1.5">URL</Label>
          <div className="w-full flex relative items-center">
            <Input
              readOnly
              value={props.url.toString()}
              placeholder=""
              className="w-full h-max pr-8"
            />
            <CopyButton
              data={props.url.toString()}
              tooltipContent="Copy URL"
              className="absolute right-0"
            />
          </div>
        </div>
        {Object.entries(headers).length > 0 && (
          <div className="w-full">
            <Label className="mb-1.5">Headers</Label>
            <CodeHighlighter content={JSON.stringify(headers)} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
