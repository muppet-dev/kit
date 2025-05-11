import { Button } from "@/client/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/client/components/ui/dropdown-menu";
import { eventHandler } from "@/client/lib/eventHandler";
import { ChevronDown } from "lucide-react";
import { useState, type BaseSyntheticEvent } from "react";
import { useMCPItem } from "../../../providers";
import { AnalyseButton } from "./AnalyseButton";
import { AnalyseDialog } from "./AnalyseDialog";
import { useAnalyse } from "./provider";
import { useConfig } from "@/client/providers";

export function AnalyseButtonGroup() {
  const { isModelsEnabled } = useConfig();

  if (!isModelsEnabled) return <></>;

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

  return <AnalyseButton onClick={handleAnalyse} onKeyDown={handleAnalyse} />;
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
