import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, numberFormatter } from "../../../lib/utils";
import dayjs from "dayjs";
import { SortingEnum, useTracing } from "../providers";
import { FilterMethod } from "./FilterMethod";
import { TableDrawer } from "./TableDrawer";
import { MoveDown, MoveUp } from "lucide-react";
import { eventHandler } from "@/lib/eventHandler";

export function TracingTable() {
  const { traces, selected, setSelected, timestampSort, toggleTimestampSort } =
    useTracing();

  const handleSortDate = eventHandler(() => toggleTimestampSort());

  const handleSelectData = (index: number) =>
    eventHandler(() => setSelected(index));

  return (
    <div className="w-full h-full flex gap-2 md:gap-3 lg:gap-4">
      <Table className="border">
        <TableHeader>
          <TableRow className="hover:bg-accent divide-x bg-accent">
            <TableHead
              onClick={handleSortDate}
              onKeyDown={handleSortDate}
              className="w-64 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                Date
                {timestampSort === SortingEnum.ASCENDING && (
                  <MoveUp className="size-3.5" />
                )}
                {timestampSort === SortingEnum.DESCENDING && (
                  <MoveDown className="size-3.5" />
                )}
              </div>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Latency</TableHead>
            <TableHead>
              <div className="flex items-center justify-between">
                Method
                <FilterMethod />
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {traces.length > 0 ? (
            traces.map((trace, index) => {
              const isError = Boolean(trace.response?.error);
              const requestWasSentOn = trace.timestamp.start;
              const monthWithDay = dayjs(requestWasSentOn).format("MMM DD");
              const time = dayjs(requestWasSentOn).format("hh:mm:ss");
              const millisecond = dayjs(requestWasSentOn).format("SSS");

              return (
                <TableRow
                  key={`row.${index + 1}`}
                  className={cn(
                    "cursor-pointer divide-x",
                    selected === index && "bg-muted/50"
                  )}
                  onClick={handleSelectData(index)}
                  onKeyDown={handleSelectData(index)}
                >
                  <TableCell className="space-x-1 font-medium uppercase">
                    <span className="text-black/50 dark:text-white/50">
                      {monthWithDay}
                    </span>
                    {time}
                    <span className="text-black/50 dark:text-white/50">
                      .{millisecond}
                    </span>
                  </TableCell>
                  <TableCell
                    className={
                      isError
                        ? "text-red-500 dark:text-red-300"
                        : "text-green-600 dark:text-green-300"
                    }
                  >
                    {isError ? "Error" : "Success"}
                  </TableCell>
                  <TableCell>
                    {trace.timestamp.latency > 1000
                      ? `${numberFormatter(
                          Number((trace.timestamp.latency / 1000).toFixed(2)),
                          "decimal"
                        )} s`
                      : `${numberFormatter(
                          trace.timestamp.latency,
                          "decimal"
                        )} ms`}
                  </TableCell>
                  <TableCell>{trace.request.method}</TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell
                className="h-[500px] text-center select-none text-muted-foreground"
                colSpan={4}
              >
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TableDrawer />
    </div>
  );
}
