import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { SparklesIcon } from "lucide-react";
import { useAnalyse } from "./provider";

export type AnalyseButton = Pick<
  React.ComponentProps<"button">,
  "onClick" | "onKeyDown" | "type"
>;

export function AnalyseButton(props: AnalyseButton) {
  const mutation = useAnalyse();

  return (
    <Button
      {...props}
      className="px-3 py-1.5"
      variant="secondary"
      disabled={mutation.isPending}
    >
      <SparklesIcon className="size-4" />
      {mutation.isPending ? "Generating" : "Generate"}
      {mutation.isPending && <Spinner className="size-4 min-w-4 min-h-4" />}
    </Button>
  );
}
