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
import { GenerateButton } from "./GenerateButton";
import { GenerateDialog } from "./GenerateDialog";
import { GenerateProvider, useGenerate } from "./provider";

export function GenerateButtonGroup() {
  return (
    <div className="flex items-center gap-0.5">
      <GenerateProvider>
        <ActionButton />
        <ActionMenu />
      </GenerateProvider>
    </div>
  );
}

function ActionButton() {
  const { selectedItem } = useMCPItem();

  const mutation = useGenerate();

  const handleGenerate = eventHandler(() =>
    mutation.mutateAsync(selectedItem!),
  );

  return <GenerateButton onClick={handleGenerate} onKeyDown={handleGenerate} />;
}

function ActionMenu() {
  const [isOpen, setOpen] = useState(false);

  const handleOpenGenerateDialog = (event: BaseSyntheticEvent) => {
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
            onClick={handleOpenGenerateDialog}
            onKeyDown={handleOpenGenerateDialog}
          >
            Generate with context
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <GenerateDialog onOpenChange={setOpen} open={isOpen} />
    </>
  );
}
