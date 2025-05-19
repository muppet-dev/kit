import { Button } from "../../../../components/ui/button";
import { eventHandler } from "../../../../lib/eventHandler";
import { ListRestart } from "lucide-react";
import { useFormContext } from "react-hook-form";

export function FormResetButton() {
  const { reset } = useFormContext();

  const handleResetForm = eventHandler(() =>
    reset({
      __reset: true,
    })
  );

  return (
    <>
      <Button
        variant="secondary"
        className="xl:flex hidden"
        onClick={handleResetForm}
        onKeyDown={handleResetForm}
      >
        <ListRestart />
        Reset
      </Button>
      <Button
        variant="secondary"
        className="xl:hidden size-max has-[>svg]:px-2.5 py-2.5"
        onClick={handleResetForm}
        onKeyDown={handleResetForm}
      >
        <ListRestart />
      </Button>
    </>
  );
}
