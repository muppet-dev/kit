import { Button } from "@/client/components/ui/button";
import { Spinner } from "@/client/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/client/components/ui/tooltip";
import { eventHandler } from "@/client/lib/eventHandler";
import { useConfig } from "@/client/providers";
import { Dices } from "lucide-react";
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
  const mutation = useGenerate();

  const handleGenerate = eventHandler(() => mutation.mutateAsync({}));

  return (
    <>
      <Button
        className="px-3 py-1.5 xl:flex hidden rounded-r-none"
        colorScheme="secondary"
        disabled={mutation.isPending}
        onClick={handleGenerate}
        onKeyDown={handleGenerate}
      >
        <Dices className="size-4" />
        {mutation.isPending ? "Randomising" : "Randomise"}
        {mutation.isPending && <Spinner className="size-4 min-w-4 min-h-4" />}
      </Button>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="xl:hidden size-max has-[>svg]:px-2.5 py-2.5 rounded-r-none"
            colorScheme="secondary"
            disabled={mutation.isPending}
            onClick={handleGenerate}
            onKeyDown={handleGenerate}
          >
            <Dices className="size-4" />
            {mutation.isPending && (
              <Spinner className="size-4 min-w-4 min-h-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Randomise</TooltipContent>
      </Tooltip>
    </>
  );
}
