import { eventHandler } from "@/client/lib/eventHandler";
import { cn } from "@/client/lib/utils";
import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
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
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) return;

    const timeoutId = setTimeout(() => {
      setIsCopied(false);
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [isCopied]);

  const handleCopyData = eventHandler(() => {
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
          disabled={!data || disabled}
          className={cn("size-max has-[>svg]:px-1.5 py-1.5", className)}
          onClick={handleCopyData}
          onKeyDown={handleCopyData}
        >
          <Icon
            className={cn(
              "size-4 stroke-2",
              isCopied && "stroke-green-500 dark:stroke-green-300",
            )}
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent hidden={!data} side={tooltipSide}>
        {isCopied ? "Copied" : (tooltipContent ?? "Copy Code")}
      </TooltipContent>
    </Tooltip>
  );
}
