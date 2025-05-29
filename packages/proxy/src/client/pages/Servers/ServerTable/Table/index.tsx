import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/client/components/ui/table";
import { TableContent } from "./Content";

export type ServersTable = TableContent;

export function ServersTable(props: ServersTable) {
  return (
    <div className="h-max grid overflow-hidden">
      <Table className="overflow-y-auto lg:table-fixed [&>thead>tr>th]:bg-accent [&>thead>tr>th]:sticky [&>thead>tr>th]:top-0 [&>thead>tr>th]:z-10">
        <TableHeader>
          <TableRow className="hover:bg-accent divide-x bg-accent">
            <TableHead>Name</TableHead>
            <TableHead className="w-32 text-center">Status</TableHead>
            <TableHead>URL / Command</TableHead>
            <TableHead className="text-right w-32">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableContent {...props} />
        </TableBody>
      </Table>
    </div>
  );
}
