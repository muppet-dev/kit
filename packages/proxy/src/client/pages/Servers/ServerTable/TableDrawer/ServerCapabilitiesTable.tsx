import { Skeleton } from "@/client/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/client/components/ui/table";

export type ServerCapabilitiesTable = {
  data?: Record<string, any>;
  isLoading?: boolean;
};

export function ServerCapabilitiesTable({
  data,
  isLoading,
}: ServerCapabilitiesTable) {
  return (
    <Table>
      <TableBody>
        <TableRow className="cursor-pointer divide-x">
          <TableCell>Tools</TableCell>
          <TableCell className="text-right">
            {isLoading ? (
              <Skeleton className="h-5 w-full" />
            ) : (
              <p>
                {data ? `${data.tools.enabled} / ${data.tools.total}` : "N/A"}
              </p>
            )}
          </TableCell>
        </TableRow>
        <TableRow className="cursor-pointer divide-x">
          <TableCell>Prompts</TableCell>
          <TableCell className="text-right">
            {isLoading ? (
              <Skeleton className="h-5 w-full" />
            ) : (
              <p>
                {data
                  ? `${data.prompts.enabled} / ${data.prompts.total}`
                  : "N/A"}
              </p>
            )}
          </TableCell>
        </TableRow>
        <TableRow className="cursor-pointer divide-x">
          <TableCell>Static Resources</TableCell>
          <TableCell className="text-right">
            {isLoading ? (
              <Skeleton className="h-5 w-full" />
            ) : (
              <p>
                {data
                  ? `${data.static_resources.enabled} / ${data.static_resources.total}`
                  : "N/A"}
              </p>
            )}
          </TableCell>
        </TableRow>
        <TableRow className="cursor-pointer divide-x">
          <TableCell>Dynamic Resources</TableCell>
          <TableCell className="text-right">
            {isLoading ? (
              <Skeleton className="h-5 w-full" />
            ) : (
              <p>
                {data
                  ? `${data.dynamic_resources.enabled} / ${data.dynamic_resources.total}`
                  : "N/A"}
              </p>
            )}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
