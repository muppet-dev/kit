import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { useTracing } from "../providers";
import { FilterMethod } from "./FilterMethod";
import { TableDrawer } from "./TableDrawer";

export function TracingTable() {
  const { traces, selected, setSelected } = useTracing();

  return (
    <div className="w-full h-full flex gap-2 md:gap-3 lg:gap-4">
      <Table className="border">
        <TableHeader>
          <TableRow className="hover:bg-accent divide-x bg-accent">
            <TableHead className="w-64">Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Latency</TableHead>
            <TableHead className="flex items-center justify-between">
              Method
              <FilterMethod />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {traces.length > 0 ? (
            traces.map((trace, index) => {
              const isError = Boolean(trace.response?.error);

              const handleClick = () => setSelected(index);

              const requestWasSentOn = trace.timestamp.start;
              const monthWithDay = dayjs(requestWasSentOn).format("MMM DD");
              const time = dayjs(requestWasSentOn).format("hh:mm:ss");
              const millisecond = dayjs(requestWasSentOn).format("SSS");

              return (
                <TableRow
                  key={`row.${index + 1}`}
                  onClick={handleClick}
                  className={cn(
                    "cursor-pointer divide-x",
                    selected === index && "bg-muted/50",
                  )}
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
                    className={isError ? "text-red-500" : "text-green-600"}
                  >
                    {isError ? "Error" : "Success"}
                  </TableCell>
                  <TableCell>{trace.timestamp.latency.toFixed(2)} ms</TableCell>
                  <TableCell>{trace.request.method}</TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell
                className="h-[500px] text-center select-none text-muted-foreground"
                colSpan={3}
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
