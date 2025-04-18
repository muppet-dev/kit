import type { transportSchema } from "@/validations";
import type { ConnectionInfo } from "@/hooks/use-connection";
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

export type ConfigurationsDialogProps = {
  onSubmit: (data: ConnectionInfo) => void;
};

export default function ConfigurationsDialog({
  onSubmit,
}: ConfigurationsDialogProps) {
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
