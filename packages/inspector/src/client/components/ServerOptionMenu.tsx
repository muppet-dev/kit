import { Button } from "@/client/components/ui/button";
import { useConfig } from "@/client/providers";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { Copy, Ellipsis } from "lucide-react";
import {
  type BaseSyntheticEvent,
  type PropsWithChildren,
  useMemo,
} from "react";
import toast from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function ServerOptionMenu({ children }: PropsWithChildren) {
  const { connectionInfo } = useConfig();
  const [_, copyToClipboard] = useCopyToClipboard();

  const serverEntry = useMemo(() => {
    switch (connectionInfo?.type) {
      case "stdio":
        return {
          command: connectionInfo.command,
          args: connectionInfo.args ? [connectionInfo.args] : undefined,
          env: connectionInfo.env,
        };
      case "sse":
        return {
          type: connectionInfo?.type,
          url: connectionInfo?.url,
          note: "For SSE connections, add this URL directly in your MCP Client",
        };
      case "streamable-http":
        return {
          type: connectionInfo?.type,
          url: connectionInfo?.url,
          note: "For Streamable HTTP connections, add this URL directly in your MCP Client",
        };
    }
  }, [connectionInfo]);

  const handleCopyServerEntry = (event: BaseSyntheticEvent) => {
    if ("key" in event && event.key !== "Enter") return;
    copyToClipboard(JSON.stringify(serverEntry, null, 2));
    toast.success("Copied server entry to clipboard");
  };

  const handleCopyServerFile = (event: BaseSyntheticEvent) => {
    if ("key" in event && event.key !== "Enter") return;
    const fileContent = {
      mcpServers: {
        "default-server": serverEntry,
      },
    };
    copyToClipboard(JSON.stringify(fileContent, null, 2));
    toast.success("Copied servers file to clipboard");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-max has-[>svg]:px-[7px] py-[7px] data-[state=open]:bg-accent dark:data-[state=open]:bg-accent/50 data-[state=open]:text-accent-foreground rounded-sm"
        >
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start">
        <DropdownMenuItem
          onClick={handleCopyServerEntry}
          onKeyDown={handleCopyServerEntry}
        >
          <Copy />
          Copy Server Entry
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleCopyServerFile}
          onKeyDown={handleCopyServerFile}
        >
          <Copy />
          Copy Servers File
        </DropdownMenuItem>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
