import { Button } from "@/client/components/ui/button";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { Copy, Ellipsis } from "lucide-react";
import type { BaseSyntheticEvent, PropsWithChildren } from "react";
import toast from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

export function ServerOptionMenu({
  children,
  url,
}: PropsWithChildren<{ url: string }>) {
  const [_, copyToClipboard] = useCopyToClipboard();

  const serverEntry = {
    type: "streamable-http",
    url,
    note: "For Streamable HTTP connections, add this URL directly in your MCP Client",
  };

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

  const handleCopyURL = (event: BaseSyntheticEvent) => {
    if ("key" in event && event.key !== "Enter") return;

    copyToClipboard(JSON.stringify(url, null, 2));
    toast.success("Copied tunnel URL to clipboard");
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
        <DropdownMenuItem onClick={handleCopyURL} onKeyDown={handleCopyURL}>
          <Copy />
          Copy URL
        </DropdownMenuItem>
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
