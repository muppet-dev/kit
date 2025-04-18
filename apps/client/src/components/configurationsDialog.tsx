import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogAction,
  AlertDialogCancel,
} from "./ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { transportSchema } from "@/../../server/src/validations/transport";
import type { ConnectionInfo } from "@/hooks/use-connection";
import { TransportType } from "@/constants";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type z from "zod";
import { Label } from "./ui/label";

export type ConfigurationsDialogProps = {
  onSubmit: (data: ConnectionInfo) => void;
};

export default function ConfigurationsDialog({
  onSubmit,
}: ConfigurationsDialogProps) {
  const methods = useForm({
    resolver: zodResolver(transportSchema),
    defaultValues: {
      transportType: TransportType.STDIO,
    },
  });

  const { handleSubmit, reset, control } = methods;

  const handleResetForm = () => reset();

  return (
    <AlertDialog open={true}>
      <AlertDialogContent>
        <AlertDialogHeader className="gap-0">
          <AlertDialogTitle>Configure Transport</AlertDialogTitle>
          <AlertDialogDescription>
            Please configure the transport settings to continue
          </AlertDialogDescription>
        </AlertDialogHeader>
        <FormProvider {...methods}>
          <form
            className="flex flex-col gap-6"
            onSubmit={handleSubmit((values: any) => onSubmit(values))}
          >
            <div className="grid grid-cols-4 w-full items-center gap-2">
              <Label htmlFor="transportType">Transport Type</Label>
              <div className="col-span-3 gap-2">
                <Controller
                  name="transportType"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      value={value}
                      onValueChange={(value) => onChange(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select transport type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={TransportType.STDIO}>
                          STDIO
                        </SelectItem>
                        <SelectItem value={TransportType.SSE}>SSE</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="col-span-4 flex flex-col gap-2">
                <FormRender />
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={handleResetForm}
                onKeyDown={handleResetForm}
              >
                Reset
              </AlertDialogCancel>
              <AlertDialogAction type="submit">Connect</AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </FormProvider>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function FormRender() {
  const { control } = useFormContext<z.infer<typeof transportSchema>>();
  const transportType = useWatch({ control, name: "transportType" });

  if (transportType === TransportType.STDIO) return <StdioForm />;
  return <SSEForm />;
}

function StdioForm() {
  const { register } = useFormContext<z.infer<typeof transportSchema>>();

  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="command">Command</Label>
        <Input
          id="command"
          className="col-span-3"
          placeholder="Enter command"
          {...register("command")}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="arguments">Arguments</Label>
        <Input
          className="col-span-3 text-md"
          placeholder="Enter arguments"
          {...register("args")}
        />
      </div>
    </>
  );
}

function SSEForm() {
  const { register } = useFormContext<z.infer<typeof transportSchema>>();

  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="url">URL</Label>
        <Input
          className="col-span-3"
          placeholder="Enter URL"
          {...register("url")}
        />
      </div>
    </>
  );
}
