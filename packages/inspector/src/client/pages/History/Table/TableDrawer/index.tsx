/* eslint-disable @typescript-eslint/no-explicit-any */
import { CodeHighlighter } from "../../../../components/Hightlighter";
import { Button } from "../../../../components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../../../components/ui/tooltip";
import { eventHandler } from "../../../../lib/eventHandler";
import { cn } from "../../../../lib/utils";
import { useConnection } from "../../../../providers";
import type { RequestHistory } from "../../../../providers/connection/manager";
import { EmptyResultSchema } from "@modelcontextprotocol/sdk/types.js";
import { ChevronDown, ChevronUp, RefreshCcw, X } from "lucide-react";
import { useState } from "react";
import { useHistory } from "../../providers";
import { UpdateRequestDialog } from "./UpdateRequestDialog";

const UPDATABLE_METHODS = [
  "tools/call",
  "resources/read",
  "prompts/get",
  "completion/complete",
];

export type TableDrawer = {
  traces: (RequestHistory & {
    request: any;
    response?: any;
  })[];
};

export function TableDrawer({ traces }: TableDrawer) {
  const { makeRequest } = useConnection();
  const [resendDirectory, setResendDirectory] = useState<
    Record<string, boolean | undefined>
  >({});
  const { selected, setSelected } = useHistory();

  const selectedHistory =
    selected != null ? traces.find((item) => item.id === selected) : null;

  if (!selectedHistory) return <></>;

  const handleGoToPreviosRequest = eventHandler(() =>
    setSelected((prev) => {
      const index = traces.findIndex((item) => item.id === selected);

      if (index != null && index > 0) {
        return traces[index - 1].id;
      }

      return prev;
    })
  );
  const handleGoToNextRequest = eventHandler(() =>
    setSelected((prev) => {
      const index = traces.findIndex((item) => item.id === selected);

      if (index != null && index < traces.length - 1) {
        return traces[index + 1].id;
      }

      return prev;
    })
  );
  const handleSendRequest = eventHandler(async () => {
    if (
      selectedHistory.request.method === "initialize" ||
      (selected &&
        selected in resendDirectory &&
        resendDirectory[selected] === true)
    )
      return;

    setResendDirectory((prev) => {
      const tmp = { ...prev };

      if (selected && !(selected in tmp && tmp[selected] === true)) {
        tmp[selected] = true;
      }

      return tmp;
    });

    await makeRequest(
      {
        method: selectedHistory.request.method,
        params: selectedHistory.request.params,
      },
      EmptyResultSchema.passthrough()
    );

    setResendDirectory((prev) => {
      const tmp = { ...prev };

      if (selected && selected in tmp) tmp[selected] = undefined;

      return tmp;
    });
  });

  const handleCloseDrawer = eventHandler(() => setSelected(null));

  const selectedIndex = traces.findIndex((item) => item.id === selected);

  return (
    <div className="p-4 w-[550px] border rounded-lg h-full flex overflow-y-auto">
      <div className="flex flex-col gap-3 size-full overflow-y-auto">
        <div className="flex items-center gap-2">
          <kbd className="text-foreground rounded bg-secondary border px-1.5 text-sm font-medium shadow">
            {selectedHistory.request.method}
          </kbd>
          <Tooltip>
            <TooltipTrigger>
              <div
                className={cn(
                  "rounded-full size-[7px] min-w-[7px] min-h-[7px]",
                  selectedHistory.response?.error
                    ? "bg-destructive"
                    : "bg-success"
                )}
              />
            </TooltipTrigger>
            <TooltipContent>
              {selectedHistory.response?.error ? "Error" : "Success"}
            </TooltipContent>
          </Tooltip>
          <div className="flex-1" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="p-1 size-max"
                disabled={selected != null && selectedIndex === 0}
                onClick={handleGoToPreviosRequest}
                onKeyDown={handleGoToPreviosRequest}
              >
                <ChevronUp />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Previous request</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="p-1 size-max"
                disabled={
                  selected != null && selectedIndex === traces.length - 1
                }
                onClick={handleGoToNextRequest}
                onKeyDown={handleGoToNextRequest}
              >
                <ChevronDown />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Next request</TooltipContent>
          </Tooltip>
          <div className="h-4 w-px bg-muted" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="p-1 size-max"
                onClick={handleCloseDrawer}
                onKeyDown={handleCloseDrawer}
              >
                <X />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Close</TooltipContent>
          </Tooltip>
        </div>
        {selectedHistory.request.method !== "initialize" && (
          <div className="flex items-center justify-end gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="p-1.5 size-max"
                  onClick={handleSendRequest}
                  onKeyDown={handleSendRequest}
                  disabled={resendDirectory[selectedHistory.id]}
                >
                  <RefreshCcw
                    className={
                      resendDirectory[selectedHistory.id]
                        ? "animate-spin"
                        : undefined
                    }
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Resend request</TooltipContent>
            </Tooltip>
            {UPDATABLE_METHODS.includes(selectedHistory.request.method) && (
              <UpdateRequestDialog request={selectedHistory.request} />
            )}
          </div>
        )}
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
    <div className="flex-1 flex flex-col gap-1 overflow-y-auto">
      <h2 className="text-sm font-semibold">{label}</h2>
      <CodeHighlighter content={content} className="max-h-full" />
    </div>
  );
}
