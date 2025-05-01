import { CodeHighlighter } from "@/components/Hightlighter";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { Request } from "@modelcontextprotocol/sdk/types.js";
import dayjs from "dayjs";
import { ChevronDown, ChevronUp, XIcon } from "lucide-react";
import { useState } from "react";

export type TracingTable = {
  data: {
    request: string;
    response?: string;
  }[];
};

export function TracingTable({ data }: TracingTable) {
  const [currentItem, setCurrentItem] = useState<{
    request: Request;
    response?: any;
  }>();
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();

  const updateSelection = (index: number) => {
    const request = JSON.parse(data[index].request);
    const response = data[index].response
      ? JSON.parse(data[index].response!)
      : undefined;
    setSelectedIndex(index);
    setCurrentItem({ request, response });
  };

  return (
    <div className="w-full flex gap-2 md:gap-3 lg:gap-4">
      <Table className="border">
        <TableHeader>
          <TableRow className="hover:bg-accent divide-x bg-accent">
            <TableHead>Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => {
            const request = JSON.parse(item.request);
            const response = item.response
              ? JSON.parse(item.response)
              : undefined;
            const isError = Boolean(response?.error);

            const handleClick = () => {
              setCurrentItem({ request, response });
              setSelectedIndex(index);
            };
            const monthWithDay = dayjs().format("MMM DD");
            const time = dayjs().format("hh:mm:ss");
            const millisecond = dayjs().format("SSS");

            return (
              <TableRow
                key={`row.${index + 1}`}
                onClick={handleClick}
                className={cn(
                  "cursor-pointer divide-x",
                  selectedIndex === index && "bg-muted/50",
                )}
              >
                <TableCell>{request.method}</TableCell>
                <TableCell
                  className={isError ? "text-red-500" : "text-green-600"}
                >
                  {isError ? "Error" : "Success"}
                </TableCell>
                <TableCell className="text-right space-x-1 font-medium">
                  <span className="text-black/50 dark:text-white/50">
                    {monthWithDay}
                  </span>
                  {time}
                  <span className="text-black/50 dark:text-white/50">
                    .{millisecond}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {currentItem && (
        <div className="p-4 w-[550px] border space-y-3 h-full overflow-y-auto">
          <div className="flex items-center gap-2">
            <kbd className="text-foreground dark:text-secondary-300 bg-secondary border px-1.5 text-sm font-medium shadow dark:shadow-none">
              {currentItem.request.method}
            </kbd>
            <p
              className={cn(
                "text-sm font-medium",
                currentItem.response?.error ? "text-red-500" : "text-green-600",
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
          {Object.values(currentItem.response).map((res) => res != null)
            .length > 0 && (
            <TracingDetails
              label="Response"
              content={JSON.stringify(currentItem.response, null, 2)}
            />
          )}
        </div>
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
