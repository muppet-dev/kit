import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/client/components/ui/tooltip";
import { Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "../../../../../components/ui/button";
import { Spinner } from "../../../../../components/ui/spinner";
import { eventHandler } from "../../../../../lib/eventHandler";
import { useConfig } from "../../../../../providers";
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
  const { reset } = useFormContext();

  const mutation = useGenerate();

  const handleGenerate = eventHandler(() =>
    mutation.mutateAsync(selectedItem!),
  );
  const prevSelectedItemRef = useRef<typeof selectedItem | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (
      prevSelectedItemRef.current &&
      selectedItem?.name !== prevSelectedItemRef.current?.name
    ) {
      mutation.reset();
      reset({ __reset: true });
    }
    prevSelectedItemRef.current = selectedItem;
  }, [selectedItem]);

  return (
    <>
      <Button
        className="px-3 py-1.5 xl:flex hidden rounded-r-none"
        colorScheme="secondary"
        disabled={mutation.isPending}
        onClick={handleGenerate}
        onKeyDown={handleGenerate}
      >
        {mutation.isPending ? (
          <Spinner className="size-4 min-w-4 min-h-4" />
        ) : (
          <Sparkles className="size-4" />
        )}

        {mutation.isPending ? "Generating" : "Generate"}
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
            {mutation.isPending ? (
              <Spinner className="size-4 min-w-4 min-h-4" />
            ) : (
              <Sparkles className="size-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Generate</TooltipContent>
      </Tooltip>
    </>
  );
}
