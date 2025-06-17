import { Transport } from "@muppet-kit/shared";
import { Controller, useFormContext } from "react-hook-form";
import type z from "zod";
import type { configTransportSchema as schema } from "../../validations";
import { FieldErrorMessage } from "../FieldErrorMessage";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ConfigurationField } from "./ConfigurationField";
import { OptionalFields } from "./OptionalFields";

export function ConfigFormFields() {
  const { control } = useFormContext<z.output<typeof schema>>();

  return (
    <>
      <div className="grid grid-cols-4 w-full items-center gap-2">
        <Label htmlFor="type">Transport Type</Label>
        <Controller
          name="type"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Select value={value} onValueChange={onChange}>
              <SelectTrigger className="w-full col-span-3 data-[state=closed]:hover:[&>svg]:opacity-100 data-[state=open]:[&>svg]:opacity-100 transition-all ease-in-out [&>svg]:transition-all [&>svg]:ease-in-out">
                <SelectValue placeholder="Select transport type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Transport.STDIO}>STDIO</SelectItem>
                <SelectItem value={Transport.SSE}>SSE</SelectItem>
                <SelectItem value={Transport.HTTP}>HTTP Streaming</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        <FieldErrorMessage name="type" />
      </div>
      <OptionalFields />
      <ConfigurationField />
    </>
  );
}
