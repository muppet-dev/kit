import { Play, RotateCcw } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "../../components/ui/button";
import { Spinner } from "../../components/ui/spinner";
import { eventHandler } from "../../lib/eventHandler";
import { cn } from "../../lib/utils";
import { useMCPScan } from "./providers";

export function ScanButton({ className, ...props }: ComponentProps<"button">) {
  const mutation = useMCPScan();

  const handleScan = eventHandler(() => mutation.mutateAsync());

  return (
    <Button
      {...props}
      disabled={mutation.isPending}
      onClick={handleScan}
      onKeyDown={handleScan}
      className={cn("h-max py-1.5", className)}
    >
      {mutation.isPending ? (
        <Spinner className="size-4 min-w-4 min-h-4" />
      ) : mutation.isSuccess || mutation.isError ? (
        <RotateCcw className="size-4" />
      ) : (
        <Play className="size-4" />
      )}
      <span className="font-semibold">
        {mutation.isPending
          ? "Scanning"
          : mutation.isSuccess
            ? "Rescan"
            : "Start"}
      </span>
    </Button>
  );
}
