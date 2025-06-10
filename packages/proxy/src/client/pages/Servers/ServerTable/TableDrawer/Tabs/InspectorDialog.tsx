import { CopyButton } from "@/client/components/CopyButton";
import { CodeHighlighter } from "@/client/components/Hightlighter";
import { Button } from "@/client/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/client/components/ui/dialog";
import { Input } from "@/client/components/ui/input";
import { Label } from "@/client/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/client/components/ui/tooltip";
import { ExternalLink, SquareMousePointer, X } from "lucide-react";

export type InspectorDialog = {
  data?: Record<string, any>;
};

const BASE_URL = "http://localhost:3553";

export function InspectorDialog({ data }: InspectorDialog) {
  const url = new URL(BASE_URL);

  const params = new URLSearchParams();

  const excludeKeys = ["name", "id", "status"];

  if (data)
    for (const [key, value] of Object.entries(data.server)) {
      if (value != null && !excludeKeys.includes(key)) {
        params.set(
          key,
          typeof value === "object" ? JSON.stringify(value) : String(value)
        );
      }
    }

  url.search = params.toString();

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="size-max has-[>svg]:px-1.5 py-1.5"
              >
                <SquareMousePointer />
              </Button>
            </DialogTrigger>
          </div>
        </TooltipTrigger>
        <TooltipContent>Inspector</TooltipContent>
      </Tooltip>
      <DialogContent isClosable={false}>
        <div className="flex justify-between">
          <DialogHeader>
            <DialogTitle>Inspector</DialogTitle>
            <DialogDescription>
              Copy the URL and run the command below to inspect your server.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-between flex-row-reverse gap-1">
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="size-max has-[>svg]:px-1.5 py-1.5"
              >
                <X />
              </Button>
            </DialogClose>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={url.toString()}
                  target="_blank"
                  rel="noreferrer"
                  className="size-max"
                >
                  <Button
                    variant="ghost"
                    className="size-max has-[>svg]:px-1.5 py-1.5"
                  >
                    <ExternalLink />
                  </Button>
                </a>
              </TooltipTrigger>
              <TooltipContent>Open in a new tab</TooltipContent>
            </Tooltip>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>
            Inspector URL (copy and share this link to inspect your server)
          </Label>
          <div className="relative flex items-center col-span-3">
            <Input
              readOnly
              value={url.toString()}
              className="w-full h-max pr-8"
            />
            <CopyButton
              className="absolute right-1"
              data={url.toString()}
              tooltipContent="Copy URL"
            />
          </div>
        </div>
        <div className="space-y-2 overflow-hidden">
          <h3 className="text-lg font-semibold">Instructions</h3>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Open your terminal and run the following command to start the
              inspector.
            </p>
            <CodeHighlighter
              content="npx muppet-kit inspector"
              tooltipContent="Copy Command"
            />
            <p className="text-sm text-muted-foreground mt-2">
              After running the command, open the Inspector UI in your browser
              using the URL provided above to view your server details.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
