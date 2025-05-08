import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { eventHandler } from "@/lib/eventHandler";
import { getMCPProxyAddress } from "@/providers/connection/manager";
import { useMutation } from "@tanstack/react-query";
import { SparklesIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
import type { ToolRender } from "./ToolRender";

export type GenerateButton = {
  selected: ToolRender["selectedCard"];
};

export function GenerateButton({ selected }: GenerateButton) {
  const { reset } = useFormContext();

  const mutation = useMutation({
    mutationFn: async (values: ToolRender["selectedCard"]) =>
      await fetch(`${getMCPProxyAddress()}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }).then(async (res) => {
        if (res.status === 200) {
          reset(await res.json());
        } else {
          toast.error("Failed to generate data.");
        }
      }),
    onSuccess: () => {
      toast.success("Data generated successfully!");
    },
    onError: (err) => {
      toast.error(err.message);
      console.error(err);
    },
  });

  const handleGenerate = eventHandler(
    async () => await mutation.mutateAsync(selected)
  );

  return (
    <Button
      className="px-3 py-1.5"
      variant="secondary"
      onClick={handleGenerate}
      onKeyDown={handleGenerate}
      disabled={mutation.isPending}
    >
      <SparklesIcon className="size-4" />
      {mutation.isPending ? "Generating" : "Generate"}
      {mutation.isPending && <Spinner className="size-4 min-w-4 min-h-4" />}
    </Button>
  );
}
