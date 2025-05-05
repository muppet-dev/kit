import { CopyButton } from "@/components/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { eventHandler } from "@/lib/eventHandler";
import { useConnection } from "@/providers";
import { ArchiveX, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { TracingTable } from "./Table";
import { TracingProvider } from "./providers";

export default function TracingPage() {
  const { requestHistory } = useConnection();

  return (
    <div className="p-4 w-full flex flex-col gap-4 overflow-y-auto">
      <PageHeader />
      {requestHistory.length > 0 ? (
        <TracingProvider>
          <TracingTable />
        </TracingProvider>
      ) : (
        <div className="size-full flex items-center justify-center gap-1.5 text-muted-foreground select-none">
          <ArchiveX className="size-4" />
          <p className="text-sm">No history found</p>
        </div>
      )}
    </div>
  );
}

function PageHeader() {
  return (
    <div className="flex items-center gap-2">
      <h2 className="text-2xl font-bold">Traces</h2>
      <div className="flex-1" />
      <CopyUrl url="https://muppet.dev" />
    </div>
  );
}

function CopyUrl(props: { url: string }) {
  const [isLoading, setLoading] = useState<boolean>(false);

  const handleRefetch = eventHandler(async () => {
    setLoading(true);

    await new Promise((resolve) => {
      setTimeout(() => {
        console.log("Refetching");
        resolve(null);
      }, 1000);
    });

    setLoading(false);
  });

  return (
    <>
      {isLoading ? (
        <Skeleton className="h-[30px] w-[300px]" />
      ) : (
        <Input readOnly value={props.url} className="max-w-[300px] h-max" />
      )}
      <CopyButton data={props.url} tooltipContent="Copy URL" />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            aria-label="copy"
            variant="ghost"
            className="size-max has-[>svg]:px-1.5 py-1.5"
            onClick={handleRefetch}
            onKeyDown={handleRefetch}
          >
            <RefreshCcw className="size-4 stroke-2" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Refetch</TooltipContent>
      </Tooltip>
    </>
  );
}
