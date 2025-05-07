import { Button } from "@/components/ui/button";
import { eventHandler } from "@/lib/eventHandler";
import { SparklesIcon } from "lucide-react";
import type { ToolRender } from "./ToolRender";

export type GenerateButton = {
  selected: ToolRender["selectedCard"];
};

export function GenerateButton({ selected }: GenerateButton) {
  const handleGenerate = eventHandler(async () => {
    await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(selected),
    });
  });

  return (
    <Button
      className="px-3 py-1.5"
      variant="secondary"
      onClick={handleGenerate}
      onKeyDown={handleGenerate}
    >
      <SparklesIcon className="size-4" />
      Generate
    </Button>
  );
}
