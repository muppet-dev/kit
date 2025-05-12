import { Button } from "@/client/components/ui/button";
import { eventHandler } from "@/client/lib/eventHandler";
import { Settings } from "lucide-react";
import { useState } from "react";
import { useMCPItem } from "../../../providers";
import { AnalyseButton } from "./AnalyseButton";
import { AnalyseDialog } from "./AnalyseDialog";
import { useAnalyse } from "./provider";

export function AnalyseButtonGroup() {
  return (
    <div className="flex items-center gap-0.5">
      <ActionButton />
      <SettingsDialogButton />
    </div>
  );
}

function ActionButton() {
  const { selectedItem } = useMCPItem();
  const mutation = useAnalyse();

  const handleAnalyse = eventHandler(() => mutation.mutateAsync(selectedItem!));

  return <AnalyseButton onClick={handleAnalyse} onKeyDown={handleAnalyse} />;
}

function SettingsDialogButton() {
  const [isOpen, setOpen] = useState(false);

  const handler = eventHandler(() => setOpen(true));

  return (
    <>
      <Button
        variant="secondary"
        onClick={handler}
        onKeyDown={handler}
        className="size-max has-[>svg]:px-2.5 py-2.5"
      >
        <Settings className="size-4" />
      </Button>
      <AnalyseDialog onOpenChange={setOpen} open={isOpen} />
    </>
  );
}
