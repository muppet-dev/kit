import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { eventHandler } from "@/lib/eventHandler";
import { getMCPProxyAddress } from "@/providers/connection/manager";
import { useMutation } from "@tanstack/react-query";
import { ChevronDown, SparklesIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
import { useMCPItem } from "../../../providers";
import type { MCPItemType } from "@/pages/Explorer/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useContextDialog } from "./providers";
import type { BaseSyntheticEvent } from "react";
import { ContextDialog } from "./types";

export function GenerateButton() {
  return (
    <div className="flex items-center gap-0.5">
      <ActionButton />
      <ActionMenu />
    </div>
  );
}

function ActionButton() {
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
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to generate data. Please try again later.");
        }

        return res.json();
      }),
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
    mutation.mutateAsync(selectedItem!)
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

function ActionMenu() {
  const { setOpen } = useContextDialog();

  const handleOpenGenerateDialog = (event: BaseSyntheticEvent) => {
    if ("key" in event && event.key !== "Enter") return;
    setOpen(ContextDialog.GENERATE);
  };

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
        <DropdownMenuItem
          onClick={handleOpenGenerateDialog}
          onKeyDown={handleOpenGenerateDialog}
        >
          Generate with context
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
