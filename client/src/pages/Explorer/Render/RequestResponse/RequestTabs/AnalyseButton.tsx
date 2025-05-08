import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { eventHandler } from "@/lib/eventHandler";
import { getMCPProxyAddress } from "@/providers/connection/manager";
import { useMutation } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import type { ToolRender } from "./ToolRender";

export type AnalyseButton = {
  selected: ToolRender["selectedCard"];
};

export function AnalyseButton({ selected }: AnalyseButton) {
  return (
    <div className="flex items-center gap-0.5">
      <ActionButton selected={selected} />
      <ActionMenu />
    </div>
  );
}

function ActionButton({ selected }: AnalyseButton) {
  const mutation = useMutation({
    mutationFn: async (values: ToolRender["selectedCard"]) =>
      await fetch(`${getMCPProxyAddress()}/analyse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }).then((res) => res.json()),
    onSuccess: (data) => {
      console.log(data);
      toast.success("Data generated successfully!");
    },
    onError: (err) => {
      toast.error(err.message);
      console.error(err);
    },
  });

  const handleGenerate = eventHandler(() => mutation.mutateAsync(selected));

  return (
    <Button
      variant="secondary"
      onClick={handleGenerate}
      onKeyDown={handleGenerate}
      disabled={mutation.isPending}
    >
      Analyse
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
