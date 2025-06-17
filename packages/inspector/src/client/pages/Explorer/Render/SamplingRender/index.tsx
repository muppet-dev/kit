import { Button } from "@/client/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/client/components/ui/tooltip";
import { useSampling } from "@/client/providers";
import { Hash, Info } from "lucide-react";
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
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" className="size-max has-[>svg]:px-1 py-1">
              <Info className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            When the server requests LLM sampling, requests will appear here for
            approval.
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="flex-1 h-full overflow-y-auto">
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
