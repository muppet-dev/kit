import { Button } from "@/client/components/ui/button";
import { eventHandler } from "@/client/lib/eventHandler";
import { ListRestart } from "lucide-react";
import { useFormContext } from "react-hook-form";

export function FormResetButton() {
  const { reset } = useFormContext();

  const onReset = eventHandler(() => reset());

  return (
    <>
      <Button
        variant="secondary"
        className="xl:flex hidden"
        onClick={onReset}
        onKeyDown={onReset}
      >
        <ListRestart />
        Reset
      </Button>
      <Button
        variant="secondary"
        className="xl:hidden size-max has-[>svg]:px-2.5 py-2.5"
        onClick={onReset}
        onKeyDown={onReset}
      >
        <ListRestart />
      </Button>
    </>
  );
}
