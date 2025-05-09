import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { eventHandler } from "@/lib/eventHandler";
import { ChevronDown } from "lucide-react";
import { useState, type BaseSyntheticEvent } from "react";
import { useMCPItem } from "../../../../providers";
import { AnalyseDialog } from "./AnalyseDialog";
import { useAnalyse } from "./provider";

export function AnalyseButtonGroup() {
  return (
    <div className="flex items-center gap-0.5">
      <ActionButton />
      <ActionMenu />
    </div>
  );
}

function ActionButton() {
  const { selectedItem } = useMCPItem();
  const mutation = useAnalyse();

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
  const [isOpen, setOpen] = useState(false);

  const handleOpenAnalyseDialog = (event: BaseSyntheticEvent) => {
    if ("key" in event && event.key !== "Enter") return;
    setOpen(true);
  };

  return (
    <>
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
            onClick={handleOpenAnalyseDialog}
            onKeyDown={handleOpenAnalyseDialog}
          >
            Analyse with context
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AnalyseDialog onOpenChange={setOpen} open={isOpen} />
    </>
  );
}
