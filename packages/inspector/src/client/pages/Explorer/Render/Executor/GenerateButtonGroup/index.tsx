import { Button } from "@/client/components/ui/button";
import { eventHandler } from "@/client/lib/eventHandler";
import { useConfig } from "@/client/providers";
import { Settings } from "lucide-react";
import { useState } from "react";
import { useMCPItem } from "../../../providers";
import { GenerateButton } from "./GenerateButton";
import { GenerateDialog } from "./GenerateDialog";
import { GenerateProvider, useGenerate } from "./provider";

export function GenerateButtonGroup() {
  const { isModelsEnabled } = useConfig();

  if (!isModelsEnabled) return <></>;

  return (
    <div className="flex items-center gap-0.5">
      <GenerateProvider>
        <ActionButton />
        <SettingsDialogButton />
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

function SettingsDialogButton() {
  const [isOpen, setOpen] = useState(false);

  const handleOpenDialog = eventHandler(() => setOpen(true));

  return (
    <>
      <Button
        variant="secondary"
        onClick={handleOpenDialog}
        onKeyDown={handleOpenDialog}
        className="size-max has-[>svg]:px-2.5 py-2.5"
      >
        <Settings className="size-4" />
      </Button>
      <GenerateDialog onOpenChange={setOpen} open={isOpen} />
    </>
  );
}
