import { CopyButton } from "@/client/components/CopyButton";
import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import { Skeleton } from "@/client/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/client/components/ui/tooltip";
import { useConnection } from "@/client/providers";
import { ArchiveX, Pickaxe, RefreshCcw } from "lucide-react";
import { TracingTable } from "./Table";
import { TracingProvider } from "./providers";
import toast from "react-hot-toast";
import { getMCPProxyAddress } from "@/client/providers/connection/manager";
import { useMutation } from "@tanstack/react-query";
import { eventHandler } from "@/client/lib/eventHandler";

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
      <TunnelLink />
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
