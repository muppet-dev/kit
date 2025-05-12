import { Button } from "@/client/components/ui/button";
import { Spinner } from "@/client/components/ui/spinner";
import { Sparkles } from "lucide-react";
import { useAnalyse } from "./provider";

export type AnalyseButton = Pick<
  React.ComponentProps<"button">,
  "onClick" | "onKeyDown" | "type"
>;

export function AnalyseButton(props: AnalyseButton) {
  const mutation = useAnalyse();

  return (
    <>
      <Button
        {...props}
        className="px-3 py-1.5 xl:flex hidden"
        variant="secondary"
        disabled={mutation.isPending}
      >
        <Sparkles className="size-4" />
        {mutation.isPending ? "Analysing" : "Analyse"}
        {mutation.isPending && <Spinner className="size-4 min-w-4 min-h-4" />}
      </Button>
      <Button
        {...props}
        className="xl:hidden size-max has-[>svg]:px-2.5 py-2.5"
        variant="secondary"
        disabled={mutation.isPending}
      >
        <Sparkles className="size-4" />
        {mutation.isPending ? "Analysing" : "Analyse"}
        {mutation.isPending && <Spinner className="size-4 min-w-4 min-h-4" />}
      </Button>
    </>
  );
}
