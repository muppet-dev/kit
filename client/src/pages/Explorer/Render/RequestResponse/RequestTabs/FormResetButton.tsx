import { Button } from "@/components/ui/button";
import { eventHandler } from "@/lib/eventHandler";
import { useFormContext } from "react-hook-form";

export function FormResetButton() {
  const { reset } = useFormContext();

  const onReset = eventHandler(() => reset());

  return (
    <Button
      className="ml-auto"
      variant="secondary"
      onClick={onReset}
      onKeyDown={onReset}
    >
      Reset
    </Button>
  );
}
