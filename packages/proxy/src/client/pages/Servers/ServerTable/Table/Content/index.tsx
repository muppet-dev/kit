import { CopyButton } from "@/client/components/CopyButton";
import { Button } from "@/client/components/ui/button";
import { TableCell, TableRow } from "@/client/components/ui/table";
import { eventHandler } from "@/client/lib/eventHandler";
import { cn } from "@/client/lib/utils";
import { Settings2 } from "lucide-react";
import { Link } from "react-router";
import { DeleteServerButton } from "./DeleteButton";

export type TableContent = {
  serversData?: Record<string, any>[];
  selected?: string;
  selectItem: (id: string) => void;
};

export function TableContent(props: TableContent) {
  if (!props.serversData || (props.serversData?.length ?? 0) === 0)
    return (
      <TableRow className="hover:bg-transparent">
        <TableCell
          className="h-[500px] text-center select-none text-muted-foreground"
          colSpan={4}
        >
          No data available
        </TableCell>
      </TableRow>
    );

  const handleSelectItem = (id: string) =>
    eventHandler(() => props.selectItem(id));

  return (
    <>
      {props.serversData?.map((server, index) => {
        return (
          <TableRow
            key={`row.${index + 1}`}
            className={cn(
              "cursor-pointer divide-x",
              props.selected === server.id && "bg-muted/50",
            )}
            onClick={handleSelectItem(server.id)}
            onKeyDown={handleSelectItem(server.id)}
          >
            <TableCell>
              <p className="truncate">{server.name}</p>
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-center">
                <div
                  className={cn(
                    "border px-1.5 w-max capitalize",
                    server.status === "online"
                      ? "text-success bg-success/10"
                      : server.status === "offline"
                        ? "text-destructive bg-destructive/10"
                        : "text-secondary-foreground bg-secondarytext-secondary-foreground/10",
                  )}
                >
                  {server.status}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <p className="truncate" title={server.url ?? server.command}>
                  {server.url ?? server.command}
                </p>
                <CopyButton
                  data={server.url ?? server.command}
                  // To remove tooltip
                  tooltipContent=""
                  className="[&>svg]:size-3.5"
                />
              </div>
            </TableCell>
            <TableCell>
              <div className="flex justify-end gap-1">
                {/* <Link to={`/servers/${server.id}`}> */}
                <Button
                  className="size-max has-[>svg]:px-1.5 py-1.5"
                  variant="ghost"
                  disabled
                >
                  <Settings2 />
                </Button>
                {/* </Link> */}
                <DeleteServerButton id={server.id} />
              </div>
            </TableCell>
          </TableRow>
        );
      })}
    </>
  );
}
