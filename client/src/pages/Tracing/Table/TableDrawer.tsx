import { CodeHighlighter } from "@/components/Hightlighter";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { eventHandler } from "@/lib/eventHandler";
import { useConnection } from "@/providers";
import { EmptyResultSchema } from "@modelcontextprotocol/sdk/types.js";
import { ChevronDown, ChevronUp, RefreshCcw, XIcon } from "lucide-react";
import { cn } from "../../../lib/utils";
import { useTracing } from "../providers";

export function TableDrawer() {
  const { makeRequest } = useConnection();
  const { traces, selected, setSelected } = useTracing();

  const selectedHistory = selected != null ? traces[selected] : null;

  if (!selectedHistory) return <></>;

  const handleSendRequest = eventHandler(() => {
    if (selectedHistory.request.method !== "initialize")
      makeRequest(
        {
          method: selectedHistory.request.method,
          params: selectedHistory.request.params,
        },
        EmptyResultSchema.passthrough()
      );
  });
  const closeDrawer = eventHandler(() => setSelected(null));

  return (
    <div className="p-4 w-[550px] border space-y-3 h-full overflow-y-auto">
      <div className="flex items-center gap-2">
        <kbd className="text-foreground dark:text-secondary-300 bg-secondary border px-1.5 text-sm font-medium shadow dark:shadow-none">
          {selectedHistory.request.method}
        </kbd>
        <p
          className={cn(
            "text-sm font-medium",
            selectedHistory.response?.error ? "text-red-500" : "text-green-600"
          )}
        >
          {selectedHistory.response?.error ? "Error" : "Success"}
        </p>
        <div className="flex-1" />
        {selectedHistory.request.method !== "initialize" ? (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="p-1 size-max"
                  onClick={handleSendRequest}
                  onKeyDown={handleSendRequest}
                >
                  <RefreshCcw className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Resend current request</TooltipContent>
            </Tooltip>
            <div className="h-4 w-px bg-muted" />
          </>
        ) : (
          <></>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="p-1 size-max"
              disabled={selected != null && selected === 0}
              onClick={() =>
                setSelected((prev) => {
                  if (prev != null && prev > 0) {
                    return prev - 1;
                  }

                  return prev;
                })
              }
            >
              <ChevronUp className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Go to previous request</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="p-1 size-max"
              disabled={selected != null && selected === traces.length - 1}
              onClick={() =>
                setSelected((prev) => {
                  if (prev != null && prev < traces.length - 1) {
                    return prev + 1;
                  }

                  return prev;
                })
              }
            >
              <ChevronDown className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Go to next request</TooltipContent>
        </Tooltip>
        <div className="h-4 w-px bg-muted" />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="p-1 size-max"
              onClick={closeDrawer}
              onKeyDown={closeDrawer}
            >
              <XIcon className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Close the drawer</TooltipContent>
        </Tooltip>
      </div>
      <TracingDetails
        label="Request"
        content={JSON.stringify(selectedHistory.request, null, 2)}
      />
      {Object.values(selectedHistory.response ?? {}).map((res) => res != null)
        .length > 0 && (
        <TracingDetails
          label="Response"
          content={JSON.stringify(selectedHistory.response, null, 2)}
        />
      )}
    </div>
  );
}

function TracingDetails({
  label,
  content,
}: {
  label: string;
  content: string;
}) {
  return (
    <div className="space-y-1">
      <h2 className="text-sm font-semibold">{label}</h2>
      <CodeHighlighter content={content} />
    </div>
  );
}
