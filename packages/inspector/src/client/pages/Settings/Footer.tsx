import { Button } from "@/client/components/ui/button";
import { Spinner } from "@/client/components/ui/spinner";
import { eventHandler } from "@/client/lib/eventHandler";
import { useConfig, useConnection } from "@/client/providers";
import { ConnectionStatus } from "@/client/providers/connection/manager";
import type { transportSchema } from "@/client/validations";
import _ from "lodash";
import { useFormContext, useWatch } from "react-hook-form";
import type z from "zod";

export function FormFooter() {
  const { connectionInfo } = useConfig();
  const { connectionStatus } = useConnection();
  const { reset, control } = useFormContext<z.infer<typeof transportSchema>>();

  const formValues = useWatch({ control });
  const isSameValues = _.isEqual(formValues, connectionInfo);
  const isConnecting = connectionStatus === ConnectionStatus.CONNECTING;

  const handleResetForm = eventHandler(() => reset(connectionInfo));

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
      <Button type="submit" disabled={isSameValues || isConnecting}>
        {isConnecting && <Spinner className="size-4 min-w-4 min-h-4" />}
        {isConnecting ? "Connecting" : "Save & connect"}
      </Button>
    </div>
  );
}
