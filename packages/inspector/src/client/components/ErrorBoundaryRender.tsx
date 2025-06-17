import { X } from "lucide-react";
import { useState } from "react";
import type { FallbackProps } from "react-error-boundary";
import { eventHandler } from "../lib/eventHandler";
import { Button } from "./ui/button";

export function ErrorBoundaryRender({ error }: FallbackProps) {
  const [showBanner, setShowBanner] = useState(true);
  const { name, message, stack } = error;

  const handleCloseBanner = eventHandler(() => setShowBanner(false));

  if (showBanner)
    return (
      <div className="flex items-center justify-center w-screen h-screen">
        <div className="relative max-w-3xl w-full mx-auto bg-background shadow-xl ring-1 ring-muted flex flex-col gap-3 p-3 max-h-[500px] rounded-[8px] overflow-hidden">
          <div className="h-1.5 bg-destructive -mt-3 -mx-3" />
          <div>
            <h2 className="text-2xl font-bold">{name}</h2>
            <p className="text-destructive text-sm">Error: {message}</p>
          </div>
          <div className="flex-1 flex flex-col gap-1 overflow-hidden">
            <h3 className="font-semibold">Source</h3>
            <pre className="overflow-auto flex-1 text-muted-foreground text-sm bg-muted px-3 py-2">
              {stack}
            </pre>
          </div>
          <Button
            title="Close"
            variant="ghost"
            className="size-max has-[>svg]:px-1 py-1 absolute top-4 right-2"
            onClick={handleCloseBanner}
            onKeyDown={handleCloseBanner}
          >
            <X />
          </Button>
        </div>
      </div>
    );
}
