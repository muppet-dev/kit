import { Input } from "@/client/components/ui/input";
import { useServersData } from "@/client/queries/useServersData";
import Fuse from "fuse.js";
import { useMemo, useState } from "react";
import { ServersTable } from "./Table";
import { TableDrawer } from "./TableDrawer";

export function ServerTable() {
  const [selected, setSelected] = useState<string>();
  const [search, setSearch] = useState<string>("");
  const { data } = useServersData();

  const serversData = useMemo(() => {
    if (!search.trim()) return data;

    const fuse = new Fuse(data ?? [], {
      keys: ["name", "url", "command"],
    });

    return fuse.search(search).map(({ item }) => item);
  }, [search, data]);

  return (
    <div className="w-full h-full flex gap-2 md:gap-3 lg:gap-4 overflow-y-auto">
      <div className="w-full flex flex-col gap-[inherit]">
        <Input
          type="search"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-h-9"
        />
        <ServersTable
          selected={selected}
          serversData={serversData}
          selectItem={setSelected}
        />
      </div>
      <TableDrawer
        selected={selected}
        data={serversData ?? []}
        goToPreviousServer={() =>
          setSelected((prev) => {
            const index = serversData?.findIndex((item) => item.id === prev);

            if (index != null && index > 0) {
              return serversData?.[index - 1].id;
            }

            return prev;
          })
        }
        goToNextServer={() =>
          setSelected((prev) => {
            const index = serversData?.findIndex((item) => item.id === prev);

            if (index != null && index < (serversData?.length ?? 0) - 1) {
              return serversData?.[index + 1].id;
            }

            return prev;
          })
        }
        closeDrawer={() => setSelected(undefined)}
      />
    </div>
  );
}
