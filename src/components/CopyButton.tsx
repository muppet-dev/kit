import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export type CopyButton = {
  data?: string;
  tooltipContent?: string;
  className?: HTMLDivElement["className"];
};

export function CopyButton({ data, className, tooltipContent }: CopyButton) {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) return;

    const timeoutId = setTimeout(() => {
      setIsCopied(false);
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [isCopied]);

  const handleCopy = () => {
    if (data) {
      navigator.clipboard.writeText(data);
      setIsCopied(true);
    }
  };

  const Icon = isCopied ? Check : Copy;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          aria-label="copy"
          variant="ghost"
          disabled={!data}
          className={className}
          onClick={handleCopy}
          onKeyDown={handleCopy}
        >
          <Icon
            className={cn(
              "size-4 stroke-2",
              isCopied && "stroke-green-500 dark:stroke-green-300"
            )}
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent hidden={!data}>
        {isCopied ? "Copied" : tooltipContent ?? "Copy Code"}
      </TooltipContent>
    </Tooltip>
  );
}
