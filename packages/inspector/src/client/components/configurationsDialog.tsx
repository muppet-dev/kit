import { eventHandler } from "@/client/lib/eventHandler";
import { CONFIG_STORAGE_KEY, useConfig } from "@/client/providers";
import type { ConnectionInfo } from "@/client/providers/connection/manager";
import type { transportSchema } from "@/client/validations";
import { Transport } from "@muppet-kit/shared";
import { useFormContext } from "react-hook-form";
import type z from "zod";
import { ConfigForm } from "./ConfigForm";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export type ConfigurationsDialogProps = {
  onSubmit: (data: ConnectionInfo) => void;
};

export function ConfigurationsDialog({ onSubmit }: ConfigurationsDialogProps) {
  const { getConfigurations } = useConfig();
  const localStorageValue = localStorage.getItem(CONFIG_STORAGE_KEY);
  const localStorageData = localStorageValue
    ? (JSON.parse(localStorageValue) as ConnectionInfo)
    : undefined;

  const formattedData =
    localStorageData?.transportType === Transport.STDIO
      ? {
          ...localStorageData,
          env: localStorageData.env
            ? typeof localStorageData.env === "string"
              ? Object.entries(JSON.parse(localStorageData.env)).map(
                  ([key, value]) => ({
                    key,
                    value: String(value),
                  }),
                )
              : localStorageData.env
            : undefined,
        }
      : localStorageData;

  const defaultConfiguration = getConfigurations();

  return (
    <Dialog open={true}>
      <DialogContent>
        <DialogHeader className="gap-0">
          <DialogTitle>Configure Transport</DialogTitle>
          <DialogDescription>
            Please configure the transport settings to continue
          </DialogDescription>
        </DialogHeader>
        <ConfigForm
          onSubmit={(values) => onSubmit(values)}
          data={defaultConfiguration ?? formattedData}
        >
          <FormFooter />
        </ConfigForm>
      </DialogContent>
    </Dialog>
  );
}

function FormFooter() {
  const { reset } = useFormContext<z.infer<typeof transportSchema>>();

  const handleResetForm = eventHandler(() =>
    reset({
      transportType: Transport.STDIO,
    }),
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
      <Button type="submit">Connect</Button>
    </DialogFooter>
  );
}
