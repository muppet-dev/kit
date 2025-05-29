import { CopyButton } from "@/client/components/CopyButton";
import { useServersData } from "@/client/queries/useServersData";
import { Server } from "lucide-react";
import { useMemo } from "react";
import { AddServerDialog } from "./AddServerDialog";
import { ServerTable } from "./ServerTable";

export default function ServersPage() {
  return (
    <div className="p-4 size-full flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Server className="size-5" />
        <h2 className="text-2xl font-bold">Servers</h2>
        <div className="flex-1" />
        <AddServerDialog />
        <CopyServersFileButton />
      </div>
      <ServerTable />
    </div>
  );
}

function CopyServersFileButton() {
  const { data } = useServersData();

  const serversFile = useMemo(() => {
    return {
      mcpServers: Object.fromEntries(
        data?.map((item) => {
          const entries = [item.name];

          if (item.transport === "stdio")
            entries.push({
              command: item.command,
              args: item.args ? [item.args] : undefined,
              env: item.env,
            });
          else if (item.transport === "sse")
            entries.push({
              type: item.transport,
              url: item.url,
              note: "For SSE connections, add this URL directly in your MCP Client",
            });
          else if (item.transport === "streamable-http")
            entries.push({
              type: item.transport,
              url: item.url,
              note: "For Streamable HTTP connections, add this URL directly in your MCP Client",
            });

          return entries;
        }) ?? []
      ),
    };
  }, [data]);

  return (
    <CopyButton
      tooltipContent="Copy servers file"
      data={JSON.stringify(serversFile, null, 2)}
    />
  );
}
