import { Transport } from "@muppet-kit/shared";
import { useFormContext } from "react-hook-form";
import { eventHandler } from "../../../../lib/eventHandler";
import { DocumentSubmitType, SUBMIT_BUTTON_KEY } from "../../../../validations";
import { Button } from "../../../ui/button";
import { DialogFooter } from "../../../ui/dialog";
import { useHotkeys } from "react-hotkeys-hook";

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

  useHotkeys("mod+enter", () => handleConnect(), {
    description: "Connect to the server",
  });
  useHotkeys("mod+shift+enter", () => handleSaveAndConnect(), {
    description: "Save and connect to the server",
  });

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
