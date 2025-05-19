import { Button } from "../../../../../components/ui/button";
import { Spinner } from "../../../../../components/ui/spinner";
import { eventHandler } from "../../../../../lib/eventHandler";
import { Sparkles } from "lucide-react";
import { useMCPItem } from "../../../providers";
import { AnalyseDialog } from "./AnalyseDialog";
import { useAnalyse } from "./provider";

export function AnalyseButtonGroup() {
  return (
    <div className="flex items-center gap-0.5">
      <ActionButton />
      <AnalyseDialog />
    </div>
  );
}

function ActionButton() {
  const { selectedItem } = useMCPItem();
  const mutation = useAnalyse();

  const handleAnalyse = eventHandler(() => mutation.mutateAsync(selectedItem!));

  return (
    <>
      <Button
        className="px-3 py-1.5 xl:flex hidden"
        variant="secondary"
        disabled={mutation.isPending}
        onClick={handleAnalyse}
        onKeyDown={handleAnalyse}
      >
        <Sparkles className="size-4" />
        {mutation.isPending ? "Analysing" : "Analyse"}
        {mutation.isPending && <Spinner className="size-4 min-w-4 min-h-4" />}
      </Button>
      <Button
        className="xl:hidden size-max has-[>svg]:px-2.5 py-2.5"
        variant="secondary"
        disabled={mutation.isPending}
        onClick={handleAnalyse}
        onKeyDown={handleAnalyse}
      >
        <Sparkles className="size-4" />
        {mutation.isPending ? "Analysing" : "Analyse"}
        {mutation.isPending && <Spinner className="size-4 min-w-4 min-h-4" />}
      </Button>
    </>
  );
}
