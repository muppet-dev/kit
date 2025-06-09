import { eventHandler } from "@/client/lib/eventHandler";
import { downloadJSON } from "@/client/lib/utils";
import { Download } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { useLogs } from "./providers";

export function DownloadButton() {
  const { logs } = useLogs();

  const onDownload = eventHandler(() =>
    downloadJSON(
      logs.map(({ id, request, response, session }) => ({
        id,
        session,
        request,
        response,
      })),
      `${new Date().toISOString()}.json`
    )
  );
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="size-max has-[>svg]:px-1.5 py-1.5"
          onClick={onDownload}
          onKeyDown={onDownload}
        >
          <Download className="size-4 stroke-2" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Download traces</TooltipContent>
    </Tooltip>
  );
}
