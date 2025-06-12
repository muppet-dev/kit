import { useSampling } from "@/client/providers";
import { Hash } from "lucide-react";
import { ToolsTabs } from "../Tabs";
import { SamplingRequest } from "./SamplingRequest";

export function SamplingRender() {
  const { pendingSampleRequests } = useSampling();

  return (
    <div className="size-full flex flex-col gap-2">
      <ToolsTabs />
      <div className="flex items-center gap-2">
        <Hash className="size-5" />
        <h2 className="text-2xl font-bold">Sampling</h2>
      </div>
      <div className="flex-1 flex flex-col gap-4 h-full overflow-y-auto">
        <div className="p-2 border rounded-md text-muted-foreground">
          When the server requests LLM sampling, requests will appear here for
          approval.
        </div>
        <div className="flex-1 flex flex-col gap-4 h-full pb-4 overflow-y-auto">
          <h3 className="text-lg font-semibold">Recent Requests</h3>
          {pendingSampleRequests.length === 0 ? (
            <div className="text-muted-foreground text-sm select-none h-full flex items-center justify-center">
              No pending requests
            </div>
          ) : (
            <div className="size-full overflow-y-auto space-y-4">
              {pendingSampleRequests.map((request) => (
                <SamplingRequest key={request.id} request={request} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
