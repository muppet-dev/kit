import type { transportSchema } from "@/validations";
import type { ConnectionInfo } from "@/providers/connection/manager";
import { useFormContext } from "react-hook-form";
import type z from "zod";
import { ConfigForm } from "./ConfigForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { CONFIG_STORAGE_KEY } from "@/providers";

export type ConfigurationsDialogProps = {
  onSubmit: (data: ConnectionInfo) => void;
};

export function ConfigurationsDialog({ onSubmit }: ConfigurationsDialogProps) {
  const localStorageValue = localStorage.getItem(CONFIG_STORAGE_KEY);
  const data = localStorageValue
    ? (JSON.parse(localStorageValue) as ConnectionInfo)
    : undefined;

  return (
    <AlertDialog open={true}>
      <AlertDialogContent>
        <AlertDialogHeader className="gap-0">
          <AlertDialogTitle>Configure Transport</AlertDialogTitle>
          <AlertDialogDescription>
            Please configure the transport settings to continue
          </AlertDialogDescription>
        </AlertDialogHeader>
        <ConfigForm
          footer={<FormFooter />}
          onSubmit={(values) => onSubmit(values)}
          data={data}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}

function FormFooter() {
  const { reset } = useFormContext<z.infer<typeof transportSchema>>();

  const handleResetForm = () => reset();

  return (
    <AlertDialogFooter>
      <AlertDialogCancel onClick={handleResetForm} onKeyDown={handleResetForm}>
        Reset
      </AlertDialogCancel>
      <AlertDialogAction type="submit">Connect</AlertDialogAction>
    </AlertDialogFooter>
  );
}
