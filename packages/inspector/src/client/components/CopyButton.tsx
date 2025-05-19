import { eventHandler } from "../lib/eventHandler";
import { cn } from "../lib/utils";
import { Check, Copy } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useCopyToClipboard } from "@uidotdev/usehooks";

export type CopyButton = {
  data?: string;
  tooltipContent?: string;
  tooltipSide?: "top" | "right" | "bottom" | "left";
  className?: HTMLDivElement["className"];
  disabled?: boolean;
};

export function CopyButton({
  data,
  className,
  tooltipContent,
  tooltipSide,
  disabled,
}: CopyButton) {
  const [isCopied, copyToClipboard] = useCopyToClipboard();

  const handleCopyToClipboard = eventHandler(() => copyToClipboard(data ?? ""));

  const Icon = isCopied ? Check : Copy;

  const button = (
    <Button
      size="icon"
      aria-label="copy"
      variant="ghost"
      disabled={!data || disabled}
      className={cn("size-max has-[>svg]:px-1.5 py-1.5", className)}
      onClick={handleCopyToClipboard}
      onKeyDown={handleCopyToClipboard}
    >
      <Icon
        className={cn(
          "size-4 stroke-2",
          isCopied && "stroke-green-500 dark:stroke-green-300"
        )}
      />
    </Button>
  );

  if (tooltipContent === "") return button;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent hidden={!data} side={tooltipSide}>
        {isCopied ? "Copied" : tooltipContent ?? "Copy Code"}
      </TooltipContent>
    </Tooltip>
  );
}
