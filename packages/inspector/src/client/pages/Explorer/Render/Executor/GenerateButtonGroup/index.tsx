import { Button } from "../../../../../components/ui/button";
import { Spinner } from "../../../../../components/ui/spinner";
import { eventHandler } from "../../../../../lib/eventHandler";
import { useConfig } from "../../../../../providers";
import { Sparkles } from "lucide-react";
import { useMCPItem } from "../../../providers";
import { GenerateDialog } from "./GenerateDialog";
import { GenerateProvider, useGenerate } from "./provider";

export function GenerateButtonGroup() {
  const { isModelsEnabled } = useConfig();

  if (!isModelsEnabled) return <></>;

  return (
    <div className="flex items-center gap-0.5">
      <GenerateProvider>
        <ActionButton />
        <GenerateDialog />
      </GenerateProvider>
    </div>
  );
}

function ActionButton() {
  const { selectedItem } = useMCPItem();

  const mutation = useGenerate();

  const handleGenerate = eventHandler(() =>
    mutation.mutateAsync(selectedItem!)
  );

  return (
    <>
      <Button
        className="px-3 py-1.5 xl:flex hidden"
        variant="secondary"
        disabled={mutation.isPending}
        onClick={handleGenerate}
        onKeyDown={handleGenerate}
      >
        <Sparkles className="size-4" />
        {mutation.isPending ? "Generating" : "Generate"}
        {mutation.isPending && <Spinner className="size-4 min-w-4 min-h-4" />}
      </Button>
      <Button
        className="xl:hidden size-max has-[>svg]:px-2.5 py-2.5"
        variant="secondary"
        disabled={mutation.isPending}
        onClick={handleGenerate}
        onKeyDown={handleGenerate}
      >
        <Sparkles className="size-4" />
        {mutation.isPending && <Spinner className="size-4 min-w-4 min-h-4" />}
      </Button>
    </>
  );
}
