import type { transportSchema } from "@/../../server/src/validations/transport";
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
          onSubmit={(values) =>
            // @ts-expect-error: The error is because of type difference in data getting from form and arg type of onSubmit function
            onSubmit(values)
          }
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
