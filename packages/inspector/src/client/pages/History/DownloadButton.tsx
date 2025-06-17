import { Download } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { eventHandler } from "../../lib/eventHandler";
import { downloadJSON } from "../../lib/utils";
import { useHistory } from "./providers";

export function DownloadButton() {
  const { traces } = useHistory();

  const onDownload = eventHandler(() =>
    downloadJSON(
      traces.map(({ id, request, response }) => ({ id, request, response })),
      `${new Date().toISOString()}.json`,
    ),
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
