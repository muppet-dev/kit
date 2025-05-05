import { eventHandler } from "@/lib/eventHandler";
import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export type CopyButton = {
  data?: string;
  tooltipContent?: string;
  tooltipSide?: "top" | "right" | "bottom" | "left";
  className?: HTMLDivElement["className"];
};

export function CopyButton({
  data,
  className,
  tooltipContent,
  tooltipSide,
}: CopyButton) {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) return;

    const timeoutId = setTimeout(() => {
      setIsCopied(false);
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [isCopied]);

  const onCopy = eventHandler(() => {
    if (data) {
      navigator.clipboard.writeText(data);
      setIsCopied(true);
    }
  });

  const Icon = isCopied ? Check : Copy;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          aria-label="copy"
          variant="ghost"
          disabled={!data}
          className={cn("size-max has-[>svg]:px-1.5 py-1.5", className)}
          onClick={onCopy}
          onKeyDown={onCopy}
        >
          <Icon
            className={cn(
              "size-4 stroke-2",
              isCopied && "stroke-green-500 dark:stroke-green-300"
            )}
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent hidden={!data} side={tooltipSide}>
        {isCopied ? "Copied" : tooltipContent ?? "Copy Code"}
      </TooltipContent>
    </Tooltip>
  );
}
