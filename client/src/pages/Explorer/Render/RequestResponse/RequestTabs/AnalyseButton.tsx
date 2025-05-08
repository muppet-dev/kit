import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { eventHandler } from "@/lib/eventHandler";
import { useMCPItem } from "@/pages/Explorer/providers/item";
import type { MCPItemType } from "@/pages/Explorer/types";
import { getMCPProxyAddress } from "@/providers/connection/manager";
import { useMutation } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

export function AnalyseButton() {
  return (
    <div className="flex items-center gap-0.5">
      <ActionButton />
      <ActionMenu />
    </div>
  );
}

function ActionButton() {
  const { selectedItem } = useMCPItem();

  const mutation = useMutation({
    mutationFn: async (values: MCPItemType) =>
      await fetch(`${getMCPProxyAddress()}/analyse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch analysis data. Please try again.");
        }

        return res.json();
      }),
    onSuccess: () => {
      toast.success("Data generated successfully!");
    },
    onError: (err) => {
      toast.error(err.message);
      console.error(err);
    },
  });

  const handleAnalyse = eventHandler(() => mutation.mutateAsync(selectedItem!));

  return (
    <Button
      variant="secondary"
      onClick={handleAnalyse}
      onKeyDown={handleAnalyse}
      disabled={mutation.isPending}
    >
      {mutation.isPending && <Spinner className="size-4 min-w-4 min-h-4" />}
      {mutation.isPending ? "Analysing" : "Analyse"}
    </Button>
  );
}

function ActionMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className="has-[>svg]:px-[3px] dark:data-[state=open]:bg-secondary/80"
        >
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Analyse with context</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
