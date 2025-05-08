import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { eventHandler } from "@/lib/eventHandler";
import { getMCPProxyAddress } from "@/providers/connection/manager";
import { useMutation } from "@tanstack/react-query";
import { SparklesIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
import { useMCPItem } from "@/pages/Explorer/providers/item";
import type { MCPItemType } from "@/pages/Explorer/types";

export function GenerateButton() {
  const { selectedItem } = useMCPItem();
  const { reset } = useFormContext();

  const mutation = useMutation({
    mutationFn: async (values: MCPItemType) =>
      await fetch(`${getMCPProxyAddress()}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }).then((res) => res.json()),
    onSuccess: (data) => {
      reset(data);
      toast.success("Data generated successfully!");
    },
    onError: (err) => {
      toast.error(err.message);
      console.error(err);
    },
  });

  const handleGenerate = eventHandler(() =>
    mutation.mutateAsync(selectedItem!),
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
