import Fuse from "fuse.js";
import { MoveDown, MoveUp } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "../../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { eventHandler } from "../../../lib/eventHandler";
import {
  SortingEnum,
  cn,
  latencyTimeFormat,
  numberFormatter,
} from "../../../lib/utils";
import { HistoryTab, useHistory } from "../providers";
import { FilterMethod } from "./FilterMethod";
import { TableDrawer } from "./TableDrawer";

export function TracingTable() {
  const {
    traces,
    tab,
    selected,
    setSelected,
    timestampSort,
    toggleTimestampSort,
  } = useHistory();
  const [search, setSearch] = useState<string>("");

  const handleSortDate = eventHandler(() => toggleTimestampSort());

  const handleSelectData = (id: string) => eventHandler(() => setSelected(id));

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
          className="min-h-9"
        />
        <div className="h-max grid overflow-hidden">
          <Table className="overflow-y-auto lg:table-fixed [&>thead>tr>th]:bg-accent [&>thead>tr>th]:sticky [&>thead>tr>th]:top-0 [&>thead>tr>th]:z-10">
            <TableHeader>
              <TableRow className="hover:bg-accent divide-x bg-accent">
                <TableHead
                  onClick={handleSortDate}
                  onKeyDown={handleSortDate}
                  className="w-64 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    Timestamp
                    {timestampSort === SortingEnum.ASCENDING && (
                      <MoveUp className="size-3.5" />
                    )}
                    {timestampSort === SortingEnum.DESCENDING && (
                      <MoveDown className="size-3.5" />
                    )}
                  </div>
                </TableHead>
                {tab.value === HistoryTab.HISTORY && (
                  <>
                    <TableHead>Status</TableHead>
                    <TableHead>Latency</TableHead>
                  </>
                )}
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

                  const time = latencyTimeFormat(trace.timestamp.start);

                  const latency =
                    "latency" in trace.timestamp
                      ? trace.timestamp.latency
                      : undefined;

                  return (
                    <TableRow
                      key={`row.${index + 1}`}
                      className={cn(
                        "cursor-pointer divide-x",
                        selected === trace.id && "bg-muted/50",
                      )}
                      onClick={handleSelectData(trace.id)}
                      onKeyDown={handleSelectData(trace.id)}
                    >
                      <TableCell className="space-x-1 font-medium uppercase">
                        <span className="text-muted-foreground">{time[0]}</span>
                        {time[1]}
                        <span className="text-muted-foreground">
                          .{time[2]}
                        </span>
                      </TableCell>
                      {latency != null && typeof latency === "number" ? (
                        <>
                          <TableCell>
                            <div
                              className={cn(
                                "border px-1.5 w-max rounded",
                                isError
                                  ? "text-destructive bg-destructive/10"
                                  : "text-success bg-success/10",
                              )}
                            >
                              {isError ? "Error" : "Success"}
                            </div>
                          </TableCell>
                          <TableCell>
                            {latency > 1000
                              ? `${numberFormatter(
                                  Number((latency / 1000).toFixed(2)),
                                  "decimal",
                                )} s`
                              : `${numberFormatter(latency, "decimal")} ms`}
                          </TableCell>
                        </>
                      ) : (
                        <></>
                      )}
                      <TableCell>{trace.request.method}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    className="h-[500px] text-center select-none text-muted-foreground"
                    colSpan={tab.value === HistoryTab.HISTORY ? 4 : 2}
                  >
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      {/* @ts-expect-error */}
      <TableDrawer traces={parsedTraces} />
    </div>
  );
}
