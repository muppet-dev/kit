import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { transportSchema as schema } from "../../../../server/src/validations/transport";
import { TransportType } from "@/constants";
import type z from "zod";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { OptionalFields } from "./OptionalFields";
import type * as React from "react";

export type ConfigForm = {
  onSubmit: (values: z.infer<typeof schema>) => void;
  footer: React.JSX.Element;
  data?: z.infer<typeof schema>;
};

export function ConfigForm(props: ConfigForm) {
  const methods = useForm<z.infer<typeof schema>>({
    // @ts-expect-error: the error is because of tranform used in validation
    resolver: zodResolver(schema),
    defaultValues: props.data ?? {
      transportType: TransportType.STDIO,
    },
  });

  const { handleSubmit, control } = methods;

  return (
    <FormProvider {...methods}>
      <form
        className="flex flex-col gap-6"
        onSubmit={handleSubmit(
          //@ts-expect-error: the error is because of tranform used in validation
          (values) => props.onSubmit(values),
          console.error
        )}
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
                    <SelectItem value={TransportType.STDIO}>STDIO</SelectItem>
                    <SelectItem value={TransportType.SSE}>SSE</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="col-span-4 flex flex-col gap-2">
            <OptionalFields />
          </div>
        </div>
        {props.footer}
      </form>
    </FormProvider>
  );
}
