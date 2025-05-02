import { CodeHighlighter } from "@/components/Hightlighter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, XIcon } from "lucide-react";
import type { TracingTable } from ".";
import type { Request } from "@modelcontextprotocol/sdk/types.js";

export type TableDrawer = {
  currentItem:
    | {
        timestamp: Date;
        request: Request;
        response?: any;
      }
    | undefined;
  selectedIndex?: number;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | undefined>>;
  setCurrentItem: React.Dispatch<
    React.SetStateAction<
      | {
          timestamp: Date;
          request: Request;
          response?: any;
        }
      | undefined
    >
  >;
  data: TracingTable["data"];
};

export function TableDrawer({
  currentItem,
  selectedIndex,
  setCurrentItem,
  setSelectedIndex,
  data,
}: TableDrawer) {
  const updateSelection = (index: number) => {
    const request = JSON.parse(data[index].request);
    const response = data[index].response
      ? JSON.parse(data[index].response!)
      : undefined;
    setSelectedIndex(index);
    setCurrentItem({ timestamp: data[index].timestamp, request, response });
  };

  if (currentItem)
    return (
      <div className="p-4 w-[550px] border space-y-3 h-full overflow-y-auto">
        <div className="flex items-center gap-2">
          <kbd className="text-foreground dark:text-secondary-300 bg-secondary border px-1.5 text-sm font-medium shadow dark:shadow-none">
            {currentItem.request.method}
          </kbd>
          <p
            className={cn(
              "text-sm font-medium",
              currentItem.response?.error ? "text-red-500" : "text-green-600"
            )}
          >
            {currentItem.response?.error ? "Error" : "Success"}
          </p>
          <div className="flex-1" />
          <Button
            size="icon"
            variant="ghost"
            className="p-1 size-max"
            disabled={selectedIndex != null && selectedIndex === 0}
            onClick={() => {
              if (selectedIndex != null && selectedIndex > 0) {
                updateSelection(selectedIndex - 1);
              }
            }}
          >
            <ChevronUp className="size-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="p-1 size-max"
            disabled={
              selectedIndex != null && selectedIndex === data.length - 1
            }
            onClick={() => {
              if (selectedIndex != null && selectedIndex < data.length - 1) {
                updateSelection(selectedIndex + 1);
              }
            }}
          >
            <ChevronDown className="size-4" />
          </Button>
          <div className="h-4 w-px bg-muted" />
          <Button
            size="icon"
            variant="ghost"
            className="p-1 size-max"
            onClick={() => {
              setCurrentItem(undefined);
              setSelectedIndex(undefined);
            }}
            onKeyDown={() => {
              setCurrentItem(undefined);
              setSelectedIndex(undefined);
            }}
          >
            <XIcon className="size-4" />
          </Button>
        </div>
        {currentItem.request && (
          <TracingDetails
            label="Request"
            content={JSON.stringify(currentItem.request, null, 2)}
          />
        )}
        {Object.values(currentItem.response ?? {}).map((res) => res != null)
          .length > 0 && (
          <TracingDetails
            label="Response"
            content={JSON.stringify(currentItem.response, null, 2)}
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
      <div className="p-2 bg-white border max-h-96 h-full overflow-y-auto dark:bg-[#0d1117]">
        <CodeHighlighter content={content} />
      </div>
    </div>
  );
}
