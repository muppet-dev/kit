import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { eventHandler } from "@/lib/eventHandler";
import dayjs from "dayjs";
import Fuse from "fuse.js";
import { MoveDown, MoveUp } from "lucide-react";
import { useMemo, useState } from "react";
import { cn, numberFormatter } from "../../../lib/utils";
import { SortingEnum, useTracing } from "../providers";
import { FilterMethod } from "./FilterMethod";
import { TableDrawer } from "./TableDrawer";

export function TracingTable() {
  const { traces, selected, setSelected, timestampSort, toggleTimestampSort } =
    useTracing();
  const [search, setSearch] = useState<string>("");

  const handleSortDate = eventHandler(() => toggleTimestampSort());

  const handleSelectData = (index: number) =>
    eventHandler(() => setSelected(index));

  const parsedTraces = useMemo(() => {
    if (!search.trim()) return traces;

    const fuse = new Fuse(traces, {
      keys: ["sRequest", "sResponse"],
    });

    return fuse.search(search).map(({ item }) => item);
  }, [search, traces]);

  return (
    <div className="w-full h-full flex gap-2 md:gap-3 lg:gap-4 overflow-y-auto">
      <div className="w-full flex flex-col gap-2">
        <Input
          type="search"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex-1 grid overflow-hidden">
          <Table className="border border-t-0 overflow-y-auto table-fixed [&>thead>tr>th]:bg-accent [&>thead>tr>th]:sticky [&>thead>tr>th]:top-0 [&>thead>tr>th]:z-10">
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
              {parsedTraces.length > 0 ? (
                parsedTraces.map((trace, index) => {
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
                        selected === index && "bg-muted/50",
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
                              Number(
                                (trace.timestamp.latency / 1000).toFixed(2),
                              ),
                              "decimal",
                            )} s`
                          : `${numberFormatter(
                              trace.timestamp.latency,
                              "decimal",
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
        </div>
      </div>
      <TableDrawer traces={parsedTraces} />
    </div>
  );
}
