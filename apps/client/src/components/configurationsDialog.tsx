import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogFooter, AlertDialogHeader, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { transportSchema } from "@/../../server/src/validations/transport"
import { ConnectionInfo } from "@/hooks/use-connection";
import { TransportType } from "@/constants";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export type ConfigurationsDialogProps = {
    onSubmit: (data: ConnectionInfo) => void;
}

export default function ConfigurationsDialog({ onSubmit }: ConfigurationsDialogProps) {

  const methods = useForm({
    resolver: zodResolver(transportSchema),
    defaultValues: {
        transportType: TransportType.STDIO
    }
  });

  const { setValue, handleSubmit, watch, reset } = methods;

  const transportType = watch("transportType");


//   const handleSave = () => {
//     try {
//       const validatedData = transportSchema.parse({
//         transportType: connectionInfo?.transportType,
//         command: connectionInfo?.transportType === TransportType.STDIO ? connectionInfo?.command : undefined,
//         sseUrl: connectionInfo?.transportType === TransportType.SSE ? connectionInfo?.sseUrl : undefined,
//         bearerToken: connectionInfo?.transportType === TransportType.SSE ? connectionInfo?.bearerToken : undefined
//       });
//       setConnectionInfo(validatedData);
//       setError("");
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Invalid configuration");
//     }
//   };

//   const handleReset = () => {
//     setConnectionInfo(null);
//   };

    return <AlertDialog open={true}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Configure Transport</AlertDialogTitle>
        <AlertDialogDescription>
          Please configure the transport settings to continue
        </AlertDialogDescription>
      </AlertDialogHeader>
      
      <form className="grid gap-4 py-4" onSubmit={handleSubmit((values: any) => onSubmit(values))}>
        <FormProvider {...methods}>
        <div className="grid grid-cols-4 w-full items-center gap-2">
          <label htmlFor="transportType" className="text-right w-full text-sm font-medium">
            Transport Type
          </label>
          <div className="col-span-3 gap-2">
            <Select value={transportType} onValueChange={(value) => setValue("transportType", value as TransportType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select transport type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TransportType.STDIO}>STDIO</SelectItem>
                <SelectItem value={TransportType.SSE}>SSE</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-4 flex flex-col gap-2">
            {transportType === TransportType.STDIO && <StdioForm />}
            {transportType === TransportType.SSE && <SSEForm />}
          </div>
        </div>
        </FormProvider>
      </form>

      <AlertDialogFooter>
        <AlertDialogCancel onClick={() => reset()}>Reset Configuration</AlertDialogCancel>
        <AlertDialogAction type="submit">Save Configuration</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
}
  
function StdioForm() {
    const {register} = useFormContext<z.infer<typeof transportSchema>>();

    return (
        <>
        <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="command" className="text-right w-full text-sm font-medium">
              Command
            </label>
            <Input
              id="command"
              className="col-span-3"
              placeholder="Enter command"
              {...register("command")}
            />
          </div><div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="arguments" className="text-right w-full text-sm font-medium">
              Arguments
            </label>
            <Input
              className="col-span-3 text-md"
              placeholder="Enter arguments"
              {...register("args")}
            />
          </div></>
    )
}

function SSEForm() {
    const {register} = useFormContext<z.infer<typeof transportSchema>>();

    return (
        <>
        <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="url" className="text-right w-full text-sm font-medium">
              URL
            </label>
            <Input
              className="col-span-3"
              placeholder="Enter URL"
              {...register("url")}
            />
          </div>
        </>
    )
}