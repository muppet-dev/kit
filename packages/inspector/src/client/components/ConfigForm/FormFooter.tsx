import { eventHandler } from "@/client/lib/eventHandler";
import { CONFIG_STORAGE_KEY } from "@/client/providers";
import type { ConnectionInfo } from "@/client/providers/connection/manager";
import { DocumentSubmitType, SUBMIT_BUTTON_KEY } from "@/client/validations";
import { Transport } from "@muppet-kit/shared";
import { useFormContext, useWatch } from "react-hook-form";
import { Button } from "../ui/button";
import { DialogFooter } from "../ui/dialog";

export function FormFooter() {
  const { reset, setValue, control } = useFormContext();

  const handleResetForm = eventHandler(() =>
    reset({
      transportType: Transport.STDIO,
    })
  );

  const handleSaveAndAddAnother = () => {
    setValue(SUBMIT_BUTTON_KEY, DocumentSubmitType.SAVE_AND_CONNECT);
  };

  const handleSave = () => {
    setValue(SUBMIT_BUTTON_KEY, DocumentSubmitType.CONNECT);
  };

  const formValues = useWatch({ control });

  const configurations = localStorage.getItem(CONFIG_STORAGE_KEY);

  const localStorageData = configurations
    ? (JSON.parse(configurations) as ConnectionInfo[])
    : undefined;

  const isSameValues = localStorageData?.find(
    (values) => formValues.id === values.name
  );

  return (
    <DialogFooter className="sm:justify-between">
      <Button
        type="button"
        variant="outline"
        onClick={handleResetForm}
        onKeyDown={handleResetForm}
      >
        Reset
      </Button>
      <div className="flex items-center justify-between gap-2">
        <Button type="submit" onClick={handleSave} onKeyDown={handleSave}>
          Connect
        </Button>
        <Button
          type="submit"
          disabled={!!isSameValues}
          onClick={handleSaveAndAddAnother}
          onKeyDown={handleSaveAndAddAnother}
        >
          Save & Connect
        </Button>
      </div>
    </DialogFooter>
  );
}
