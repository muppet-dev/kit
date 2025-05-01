import { useConnection } from "@/providers";
import { ArchiveX } from "lucide-react";
import { TracingTable } from "./Table";

export function TracingPage() {
  const { requestHistory } = useConnection();

  return (
    <div className="p-4 w-full flex flex-col gap-4 overflow-y-auto">
      <h2 className="text-2xl font-bold">Traces</h2>
      {requestHistory.length > 0 ? (
        <TracingTable data={requestHistory} />
      ) : (
        <div className="size-full flex items-center justify-center gap-1.5 text-muted-foreground select-none">
          <ArchiveX className="size-4" />
          <p className="text-sm">No history found</p>
        </div>
      )}
    </div>
  );
}
