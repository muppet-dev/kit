import { useCopyToClipboard } from "@uidotdev/usehooks";
import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { eventHandler } from "../lib/eventHandler";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

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
  const [_, copyToClipboard] = useCopyToClipboard();
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) return;

    const timeoutId = setTimeout(() => {
      setIsCopied(false);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [isCopied]);

  const handleCopyToClipboard = eventHandler(() => {
    copyToClipboard(data ?? "");
    setIsCopied(true);
  });

  const Icon = isCopied ? Check : Copy;

  const button = (
    <Button
      size="icon"
      aria-label="copy"
      variant="ghost"
      disabled={!data || disabled}
      className={cn("size-max has-[>svg]:px-1.5 py-1.5 rounded-sm", className)}
      onClick={handleCopyToClipboard}
      onKeyDown={handleCopyToClipboard}
    >
      <Icon className={cn("size-4 stroke-2", isCopied && "stroke-success")} />
    </Button>
  );

  if (tooltipContent === "") return button;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent hidden={!data} side={tooltipSide}>
        {isCopied ? "Copied" : (tooltipContent ?? "Copy Code")}
      </TooltipContent>
    </Tooltip>
  );
}
