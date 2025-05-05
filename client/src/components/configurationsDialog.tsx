import { Transport } from "@/constants";
import { eventHandler } from "@/lib/eventHandler";
import { CONFIG_STORAGE_KEY } from "@/providers";
import type { ConnectionInfo } from "@/providers/connection/manager";
import type { transportSchema } from "@/validations";
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
  const localStorageValue = localStorage.getItem(CONFIG_STORAGE_KEY);
  const data = localStorageValue
    ? (JSON.parse(localStorageValue) as ConnectionInfo)
    : undefined;

  const formattedData =
    data?.transportType === Transport.STDIO
      ? {
          ...data,
          env: data.env
            ? // @ts-expect-error: formatting env data
              Object.entries(JSON.parse(data.env)).map(([key, value]) => ({
                key,
                value,
              }))
            : undefined,
        }
      : data;

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
          footer={<FormFooter />}
          onSubmit={(values) => onSubmit(values)}
          // @ts-expect-error: formatted data
          data={formattedData}
        />
      </DialogContent>
    </Dialog>
  );
}

function FormFooter() {
  const { reset } = useFormContext<z.infer<typeof transportSchema>>();

  const onReset = eventHandler(() =>
    reset({
      transportType: Transport.STDIO,
    })
  );

  return (
    <DialogFooter className="sm:justify-between">
      <Button
        type="button"
        variant="outline"
        onClick={onReset}
        onKeyDown={onReset}
      >
        Reset
      </Button>
      <Button type="submit">Connect</Button>
    </DialogFooter>
  );
}
