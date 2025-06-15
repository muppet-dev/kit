import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/client/components/ui/tooltip";
import { Sparkles } from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import { Spinner } from "../../../../../components/ui/spinner";
import { eventHandler } from "../../../../../lib/eventHandler";
import { AnalyseDialog } from "./AnalyseDialog";
import { useAnalyse } from "./useAnalyse";

export function AnalyseButtonGroup() {
  return (
    <div className="flex items-center gap-0.5">
      <ActionButton />
      <AnalyseDialog />
    </div>
  );
}

function ActionButton() {
  const { isFetching, refetch } = useAnalyse();

  const handleAnalyse = eventHandler(() => refetch());

  return (
    <>
      <Button
        className="px-3 py-1.5 xl:flex hidden rounded-r-none"
        colorScheme="secondary"
        disabled={isFetching}
        onClick={handleAnalyse}
        onKeyDown={handleAnalyse}
      >
        {isFetching ? (
          <Spinner className="size-4 min-w-4 min-h-4" />
        ) : (
          <Sparkles className="size-4" />
        )}
        {isFetching ? "Analysing" : "Analyse"}
      </Button>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="xl:hidden size-max has-[>svg]:px-2.5 py-2.5 rounded-r-none"
            colorScheme="secondary"
            disabled={isFetching}
            onClick={handleAnalyse}
            onKeyDown={handleAnalyse}
          >
            {isFetching ? (
              <Spinner className="size-4 min-w-4 min-h-4" />
            ) : (
              <Sparkles className="size-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Analyse</TooltipContent>
      </Tooltip>
    </>
  );
}
