import { Transport } from "@muppet-kit/shared";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { eventHandler } from "../../../../lib/eventHandler";
import { DocumentSubmitType, SUBMIT_BUTTON_KEY } from "../../../../validations";
import { Button } from "../../../ui/button";
import { DialogFooter } from "../../../ui/dialog";

export function FormFooter() {
  const { reset, setValue } = useFormContext();

  const handleResetForm = eventHandler(() =>
    reset({
      type: Transport.STDIO,
    }),
  );

  const handleSaveAndConnect = eventHandler(() =>
    setValue(SUBMIT_BUTTON_KEY, DocumentSubmitType.SAVE_AND_CONNECT),
  );

  const handleConnect = eventHandler(() =>
    setValue(SUBMIT_BUTTON_KEY, DocumentSubmitType.CONNECT),
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "Enter" &&
        event.shiftKey &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        const saveAndConnectButton = document.getElementById(
          DocumentSubmitType.SAVE_AND_CONNECT,
        ) as HTMLButtonElement | null;

        if (saveAndConnectButton) saveAndConnectButton.click();
      } else if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        const connectButton = document.getElementById(
          DocumentSubmitType.CONNECT,
        ) as HTMLButtonElement | null;

        if (connectButton) connectButton.click();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <DialogFooter className="sm:justify-start">
      <Button
        variant="outline"
        onClick={handleResetForm}
        onKeyDown={handleResetForm}
      >
        Reset
      </Button>
      <div className="flex-1" />
      <Button
        id={DocumentSubmitType.CONNECT}
        type="submit"
        onClick={handleConnect}
        onKeyDown={handleConnect}
      >
        Connect
      </Button>
      <Button
        id={DocumentSubmitType.SAVE_AND_CONNECT}
        type="submit"
        onClick={handleSaveAndConnect}
        onKeyDown={handleSaveAndConnect}
      >
        Save & Connect
      </Button>
    </DialogFooter>
  );
}
