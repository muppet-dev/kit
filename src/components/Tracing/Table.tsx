import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export type TracingTable = {
  data: {
    request: string;
    response?: string;
  }[];
};

export function TracingTable({ data }: TracingTable) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Method</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => {
          const request = JSON.parse(item.request);
          const response = item.response
            ? JSON.parse(item.response)
            : undefined;
          const isError = Boolean(response?.error);

          return (
            <TableRow key={`row.${index + 1}`}>
              <TableCell>{new Date().toISOString()}</TableCell>
              <TableCell
                className={isError ? "text-red-500" : "text-green-600"}
              >
                {isError ? "Error" : "Success"}
              </TableCell>
              <TableCell className="text-right">{request.method}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
