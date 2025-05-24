import { Plus, Server } from "lucide-react";
import { ServerTable } from "./ServerTable";
import { Link } from "react-router";
import { Button } from "@/client/components/ui/button";

export default function ServersPage() {
  return (
    <div className="p-4 size-full flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Server className="size-5" />
        <h2 className="text-2xl font-bold">Servers</h2>
        <div className="flex-1" />
        <Link to="/servers/add">
          <Button>
            <Plus />
            Add Server
          </Button>
        </Link>
      </div>
      <div className="size-full flex-1 flex flex-col gap-4 overflow-y-auto">
        <ServerTable />
      </div>
    </div>
  );
}
