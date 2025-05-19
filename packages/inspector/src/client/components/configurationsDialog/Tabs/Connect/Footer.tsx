import { eventHandler } from "../../../../lib/eventHandler";
import { DocumentSubmitType, SUBMIT_BUTTON_KEY } from "../../../../validations";
import { Transport } from "@muppet-kit/shared";
import type { BaseSyntheticEvent } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "../../../ui/button";
import { DialogFooter } from "../../../ui/dialog";

export function FormFooter() {
  const { reset, setValue } = useFormContext();

  const handleResetForm = eventHandler(() =>
    reset({
      type: Transport.STDIO,
    })
  );

  const handleSaveAndConnect = (event: BaseSyntheticEvent) => {
    if ("key" in event && event.key !== "Enter") return;

    setValue(SUBMIT_BUTTON_KEY, DocumentSubmitType.SAVE_AND_CONNECT);
  };

  const handleConnect = (event: BaseSyntheticEvent) => {
    if ("key" in event && event.key !== "Enter") return;

    setValue(SUBMIT_BUTTON_KEY, DocumentSubmitType.CONNECT);
  };

  return (
    <DialogFooter className="sm:justify-start">
      <Button
        type="button"
        variant="outline"
        onClick={handleResetForm}
        onKeyDown={handleResetForm}
      >
        Reset
      </Button>
      <div className="flex-1" />
      <Button type="submit" onClick={handleConnect} onKeyDown={handleConnect}>
        Connect
      </Button>
      <Button
        type="submit"
        onClick={handleSaveAndConnect}
        onKeyDown={handleSaveAndConnect}
      >
        Save & Connect
      </Button>
    </DialogFooter>
  );
}
