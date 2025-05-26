import { Input } from "@/client/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/client/components/ui/table";
import { eventHandler } from "@/client/lib/eventHandler";
import { cn } from "@/client/lib/utils";
import { useServersData } from "@/client/queries/useServersData";
import Fuse from "fuse.js";
import { useMemo, useState } from "react";
import { DeleteButton } from "./DeleteButton";
import { TableDrawer } from "./TableDrawer";
import { Link } from "react-router";
import { Button } from "@/client/components/ui/button";
import { Settings2 } from "lucide-react";

export function ServerTable() {
  const [selected, setSelected] = useState<string>();
  const [search, setSearch] = useState<string>("");
  const { data } = useServersData();

  const handleSelectData = (id: string) => eventHandler(() => setSelected(id));

  const serversData = useMemo(() => {
    if (!search.trim()) return data;

    const fuse = new Fuse(data ?? [], {
      keys: ["name", "url", "command"],
    });

    return fuse.search(search).map(({ item }) => item);
  }, [search, data]);

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
                <TableHead>Name</TableHead>
                <TableHead className="w-32 text-center">Status</TableHead>
                <TableHead>URL / Command</TableHead>
                <TableHead className="text-right w-32">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(serversData?.length ?? 0) > 0 ? (
                serversData?.map((server, index) => {
                  return (
                    <TableRow
                      key={`row.${index + 1}`}
                      className={cn(
                        "cursor-pointer divide-x",
                        selected === server.id && "bg-muted/50"
                      )}
                      onClick={handleSelectData(server.id)}
                      onKeyDown={handleSelectData(server.id)}
                    >
                      <TableCell>
                        <p className="truncate">{server.name}</p>
                      </TableCell>
                      <TableCell className="flex items-center justify-center">
                        <div
                          className={cn(
                            "border px-1.5 w-max capitalize",
                            server.status === "online"
                              ? "text-success bg-success/10"
                              : server.status === "offline"
                              ? "text-destructive bg-destructive/10"
                              : "text-secondary-foreground bg-secondarytext-secondary-foreground/10"
                          )}
                        >
                          {server.status}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p
                          className="truncate"
                          title={server.url ?? server.command}
                        >
                          {server.url ?? server.command}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Link to={`/servers/${server.id}`}>
                            <Button
                              className="size-max has-[>svg]:px-1.5 py-1.5"
                              variant="ghost"
                            >
                              <Settings2 />
                            </Button>
                          </Link>
                          <DeleteButton id={server.id} />
                        </div>
                      </TableCell>
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
      <TableDrawer
        selected={selected}
        setSelected={setSelected}
        data={serversData ?? []}
      />
    </div>
  );
}
