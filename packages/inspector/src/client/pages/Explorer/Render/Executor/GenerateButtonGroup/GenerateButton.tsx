import { Button } from "@/client/components/ui/button";
import { Spinner } from "@/client/components/ui/spinner";
import { SparklesIcon } from "lucide-react";
import { useGenerate } from "./provider";

export type GenerateButton = Pick<
  React.ComponentProps<"button">,
  "onClick" | "onKeyDown" | "type"
>;

export function GenerateButton(props: GenerateButton) {
  const mutation = useGenerate();

  return (
    <>
      <Button
        {...props}
        className="px-3 py-1.5 xl:flex hidden"
        variant="secondary"
        disabled={mutation.isPending}
      >
        <SparklesIcon className="size-4" />
        {mutation.isPending ? "Generating" : "Generate"}
        {mutation.isPending && <Spinner className="size-4 min-w-4 min-h-4" />}
      </Button>
      <Button
        {...props}
        className="xl:hidden size-max has-[>svg]:px-2.5 py-2.5"
        variant="secondary"
        disabled={mutation.isPending}
      >
        <SparklesIcon className="size-4" />
        {mutation.isPending && <Spinner className="size-4 min-w-4 min-h-4" />}
      </Button>
    </>
  );
}
