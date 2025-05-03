import { useConnection } from "@/providers";
import { ArchiveX, Copy } from "lucide-react";
import { TracingTable } from "./Table";
import { TracingProvider } from "./providers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CopyButton } from "@/components/CopyButton";

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
  return (
    <>
      <Input readOnly value={props.url} className="max-w-[300px] h-max" />
      <CopyButton data={props.url} tooltipContent="Copy URL" />
    </>
  );
}
