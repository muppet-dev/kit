import type { ConnectionInfo } from "@/client/providers/connection/manager";
import { transportSchema as schema } from "@/client/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Transport } from "@muppet-kit/shared";
import type { PropsWithChildren } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
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

export type ConfigForm = {
  onSubmit: (values: ConnectionInfo) => void;
  data?: ConnectionInfo;
};

export function ConfigForm(props: PropsWithChildren<ConfigForm>) {
  const methods = useForm<z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: props.data ?? {
      transportType: Transport.STDIO,
    },
  });

  const { handleSubmit, control } = methods;

  return (
    <FormProvider {...methods}>
      <form
        className="flex flex-col gap-6"
        onSubmit={handleSubmit((values) => {
          const _values = values;

          if (_values.transportType === Transport.STDIO && _values.env) {
            // @ts-expect-error: converting data from array of object to string in order to store it in local storage
            _values.env =
              _values.env.length > 0
                ? JSON.stringify(
                    Object.fromEntries(
                      _values.env.map((item) => [item.key, item.value]),
                    ),
                  )
                : undefined;
          }

          props.onSubmit(_values);
        }, console.error)}
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
                  <SelectTrigger className="w-full data-[state=closed]:hover:[&>svg]:opacity-100 data-[state=open]:[&>svg]:opacity-100 transition-all ease-in-out [&>svg]:transition-all [&>svg]:ease-in-out">
                    <SelectValue placeholder="Select transport type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Transport.STDIO}>STDIO</SelectItem>
                    <SelectItem value={Transport.SSE}>SSE</SelectItem>
                    <SelectItem value={Transport.HTTP}>
                      HTTP Streaming
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="col-span-4 flex flex-col gap-2">
            <OptionalFields />
          </div>
        </div>
        {props.children}
      </form>
    </FormProvider>
  );
}
