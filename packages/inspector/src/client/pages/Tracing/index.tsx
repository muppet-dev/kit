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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/client/components/ui/tooltip";
import { eventHandler } from "@/client/lib/eventHandler";
import { useConfig } from "@/client/providers";
import { ListX, Logs, Pickaxe } from "lucide-react";
import type { BaseSyntheticEvent } from "react";
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
  const onClear = eventHandler(() => {
    console.log("Clear logs");
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

  const handler =
    (linkType: "local" | "public") => (event: BaseSyntheticEvent) => {
      if ("key" in event && event.key !== "Enter") return;

      createLink.mutateAsync(linkType);
    };

  return (
    <>
      {createLink.isPending ? (
        <Skeleton className="h-[30px] w-[300px]" />
      ) : (
        createLink.data && (
          <div className="w-[300px] flex relative items-center">
            <Input
              readOnly
              value={createLink.data?.url.toString()}
              placeholder=""
              className="w-full h-max pr-8"
            />
            <CopyButton
              data={createLink.data?.url.toString()}
              tooltipContent="Copy URL"
              disabled={createLink.isPending}
              className="absolute right-0"
            />
          </div>
        )
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
            onClick={handler("local")}
            onKeyDown={handler("local")}
          >
            Local Tunnel
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!isTunnelingEnabled || createLink.isPending}
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
