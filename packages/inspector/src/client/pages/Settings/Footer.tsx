import _ from "lodash";
import type { BaseSyntheticEvent } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import type z from "zod";
import { Button } from "../../components/ui/button";
import { Spinner } from "../../components/ui/spinner";
import { eventHandler } from "../../lib/eventHandler";
import { useConfig, useConnection } from "../../providers";
import { ConnectionStatus } from "../../providers/connection/manager";
import {
  DocumentSubmitType,
  SUBMIT_BUTTON_KEY,
  type configTransportSchema,
} from "../../validations";

export function FormFooter() {
  const { connectionInfo } = useConfig();
  const { connectionStatus } = useConnection();
  const { reset, control, setValue } =
    useFormContext<z.infer<typeof configTransportSchema>>();

  const formValues = useWatch({ control });
  const isSameValues = _.isEqual(formValues, connectionInfo);
  const isConnecting = connectionStatus === ConnectionStatus.CONNECTING;

  const handleResetForm = eventHandler(() => reset(connectionInfo));

  const handleConnect = (event: BaseSyntheticEvent) => {
    if ("key" in event && event.key !== "Enter") return;

    setValue(SUBMIT_BUTTON_KEY, DocumentSubmitType.CONNECT);
  };

  return (
    <div className="flex items-center justify-between mt-4">
      <Button
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
        onClick={handleConnect}
        onKeyDown={handleConnect}
      >
        {isConnecting && <Spinner className="size-4 min-w-4 min-h-4" />}
        {isConnecting ? "Connecting" : "Connect"}
      </Button>
    </div>
  );
}
