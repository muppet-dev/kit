import { Button } from "@/client/components/ui/button";
import { Spinner } from "@/client/components/ui/spinner";
import { eventHandler } from "@/client/lib/eventHandler";
import { useConfig, useConnection } from "@/client/providers";
import { ConnectionStatus } from "@/client/providers/connection/manager";
import {
  DocumentSubmitType,
  SUBMIT_BUTTON_KEY,
  type configTransportSchema,
} from "@/client/validations";
import _ from "lodash";
import { useFormContext, useWatch } from "react-hook-form";
import type z from "zod";

export function FormFooter() {
  const { connectionInfo } = useConfig();
  const { connectionStatus } = useConnection();
  const { reset, control, setValue } =
    useFormContext<z.infer<typeof configTransportSchema>>();

  const formValues = useWatch({ control });
  const isSameValues = _.isEqual(formValues, connectionInfo);
  const isConnecting = connectionStatus === ConnectionStatus.CONNECTING;

  const handleResetForm = eventHandler(() => reset(connectionInfo));

  const handleSaveAndAddAnother = () => {
    setValue(SUBMIT_BUTTON_KEY, DocumentSubmitType.SAVE_AND_CONNECT);
  };

  return (
    <div className="flex items-center justify-between">
      <Button
        type="button"
        variant="outline"
        disabled={isSameValues}
        onClick={handleResetForm}
        onKeyDown={handleResetForm}
      >
        Reset
      </Button>
      <Button
        type="submit"
        disabled={isSameValues || isConnecting}
        onClick={handleSaveAndAddAnother}
        onKeyDown={handleSaveAndAddAnother}
      >
        {isConnecting && <Spinner className="size-4 min-w-4 min-h-4" />}
        {isConnecting ? "Connecting" : "Save & connect"}
      </Button>
    </div>
  );
}
