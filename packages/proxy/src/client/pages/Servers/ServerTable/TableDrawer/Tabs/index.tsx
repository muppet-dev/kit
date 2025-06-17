import { CopyButton } from "@/client/components/CopyButton";
import { Button } from "@/client/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/client/components/ui/tabs";
import { Logs } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router";
import { ServerForm } from "../../../Form";
import { InspectorDialog } from "./InspectorDialog";
import { ServerCapabilitiesTable } from "./ServerCapabilitiesTable";

export type DrawerTabs = {
  data?: Record<string, any>;
  isLoading?: boolean;
};

export function DrawerTabs(props: DrawerTabs) {
  return (
    <Tabs defaultValue="info">
      <div className="w-full flex items-center gap-1">
        <TabsList>
          <TabsTrigger
            value="info"
            className="data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-primary cursor-pointer py-1.5 px-5 dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
          >
            Info
          </TabsTrigger>
          <TabsTrigger
            value="setting"
            className="data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-primary cursor-pointer py-1.5 px-5 dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
          >
            Settings
          </TabsTrigger>
        </TabsList>
        <div className="flex-1" />
        <Link to={`/tracing?server=${props.data?.server.id}`}>
          <Button variant="ghost" className="size-max has-[>svg]:px-1.5 py-1.5">
            <Logs />
          </Button>
        </Link>
        <CopyServerEntryButton data={props.data} />
        <InspectorDialog data={props.data} />
      </div>
      <TabsContent value="info">
        <ServerCapabilitiesTable
          data={props.data}
          isLoading={props.isLoading}
        />
      </TabsContent>
      <TabsContent value="setting">
        <ServerForm type="edit" data={props.data?.server} />
      </TabsContent>
    </Tabs>
  );
}

function CopyServerEntryButton(props: { data?: Record<string, any> }) {
  const serverEntry = useMemo(() => {
    switch (props.data?.server.type) {
      case "stdio":
        return {
          command: props.data?.server.command,
          args: props.data?.server.args ? [props.data?.server.args] : undefined,
          env: props.data?.server.env,
        };
      case "sse":
        return {
          type: props.data?.server.type,
          url: props.data?.server.url,
          note: "For SSE connections, add this URL directly in your MCP Client",
        };
      case "streamable-http":
        return {
          type: props.data?.server.type,
          url: props.data?.server.url,
          note: "For Streamable HTTP connections, add this URL directly in your MCP Client",
        };
    }
  }, [props.data]);

  if (serverEntry)
    return (
      <CopyButton
        data={JSON.stringify(serverEntry, null, 2)}
        tooltipContent="Copy server entry"
      />
    );
}
