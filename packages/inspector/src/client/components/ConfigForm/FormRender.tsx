import type { configTransportSchema as schema } from "@/client/validations";
import { Transport } from "@muppet-kit/shared";
import type { PropsWithChildren } from "react";
import { Controller, useFormContext } from "react-hook-form";
import type z from "zod";
import type { ConfigForm } from ".";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { OptionalFields } from "./OptionalFields";
import { useConfigForm } from "./useConfigForm";

export type FormRender = Pick<ConfigForm, "onSubmit" | "isTab">;

export function FormRender(props: PropsWithChildren<FormRender>) {
  const { register, handleSubmit, control } =
    useFormContext<z.output<typeof schema>>();

  const mutation = useConfigForm({ onSubmit: props.onSubmit });

  return (
    <form
      className="flex flex-col h-full gap-6 flex-1"
      onSubmit={handleSubmit(
        (values) => mutation.mutateAsync(values),
        console.error
      )}
    >
      <div className="flex flex-col justify-between h-full gap-6">
        <div className="grid grid-cols-4 w-full items-center gap-2 overflow-y-auto max-h-[340px]">
          {props.isTab && (
            <>
              <Label htmlFor="transportType">Name</Label>
              <div className="col-span-3 gap-2">
                <Input
                  {...register("name")}
                  placeholder="Enter Name"
                  className="col-span-3"
                />
              </div>
            </>
          )}
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
      </div>
    </form>
  );
}
