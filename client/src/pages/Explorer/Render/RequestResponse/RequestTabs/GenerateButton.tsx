import { Button } from "@/components/ui/button";
import { eventHandler } from "@/lib/eventHandler";
import { SparklesIcon } from "lucide-react";
import type { ToolRender } from "./ToolRender";
import { getMCPProxyAddress } from "@/providers/connection/manager";
import toast from "react-hot-toast";
import { useFormContext } from "react-hook-form";

export type GenerateButton = {
  selected: ToolRender["selectedCard"];
};

export function GenerateButton({ selected }: GenerateButton) {
  const { reset } = useFormContext();

  const handleGenerate = eventHandler(async () => {
    await fetch(`${getMCPProxyAddress()}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(selected),
    }).then(async (res) => {
      if (res.status === 200) {
        reset(await res.json());
      } else {
        toast.error("Failed to generate data.");
      }
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
