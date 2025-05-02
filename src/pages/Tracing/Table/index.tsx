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
import { useEffect, useState } from "react";
import { FILTER_OPTIONS, FilterMethod } from "./FilterMethod";
import { TableDrawer } from "./TableDrawer";

export type TracingTable = {
  data: {
    timestamp: Date;
    request: string;
    response?: string;
  }[];
};

export function TracingTable({ data }: TracingTable) {
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(
    new Set(FILTER_OPTIONS)
  );
  const [filterData, setFilterData] = useState(data);
  const [currentItem, setCurrentItem] = useState<{
    timestamp: Date;
    request: Request;
    response?: any;
  }>();
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();

  useEffect(() => {
    if (selectedFilters.size > 0)
      setFilterData(
        data.filter((item) =>
          selectedFilters.has(JSON.parse(item.request).method)
        )
      );
    else if (selectedFilters.size === 0) setFilterData([]);
    else setFilterData(data);
  }, [data, selectedFilters]);

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
              <FilterMethod
                selectedFilters={selectedFilters}
                setSelectedFilters={setSelectedFilters}
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterData.length > 0 ? (
            filterData.map((item, index) => {
              const request = JSON.parse(item.request);
              const response = item.response
                ? JSON.parse(item.response)
                : undefined;
              const isError = Boolean(response?.error);

              const handleClick = () => {
                setCurrentItem({
                  timestamp: item.timestamp,
                  request,
                  response,
                });
                setSelectedIndex(index);
              };
              const monthWithDay = dayjs(item.timestamp).format("MMM DD");
              const time = dayjs(item.timestamp).format("hh:mm:ss");
              const millisecond = dayjs(item.timestamp).format("SSS");

              return (
                <TableRow
                  key={`row.${index + 1}`}
                  onClick={handleClick}
                  className={cn(
                    "cursor-pointer divide-x",
                    selectedIndex === index && "bg-muted/50"
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
                  <TableCell>Latency</TableCell>
                  <TableCell>{request.method}</TableCell>
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
      <TableDrawer
        currentItem={currentItem}
        data={data}
        selectedIndex={selectedIndex}
        setCurrentItem={setCurrentItem}
        setSelectedIndex={setSelectedIndex}
      />
    </div>
  );
}
