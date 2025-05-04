import { Transport } from "@/constants";
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
          data={data}
        />
      </DialogContent>
    </Dialog>
  );
}

function FormFooter() {
  const { reset } = useFormContext<z.infer<typeof transportSchema>>();

  return (
    <DialogFooter className="sm:justify-between">
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          reset({
            transportType: Transport.STDIO,
          });
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter")
            reset({
              transportType: Transport.STDIO,
            });
        }}
      >
        Reset
      </Button>
      <Button type="submit">Connect</Button>
    </DialogFooter>
  );
}
