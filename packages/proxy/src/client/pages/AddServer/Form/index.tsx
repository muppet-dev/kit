import { configValidation } from "@/client/validations";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type z from "zod";
import { useConfigForm } from "./useConfigForm";
import { Label } from "@/client/components/ui/label";
import { Input } from "@/client/components/ui/input";
import { FieldErrorMessage } from "@/client/components/FieldErrorMessage";
import { OptionalFields } from "./OptionalFields";
import { Transport } from "@muppet-kit/shared";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/client/components/ui/select";

export function AddServerForm() {
  const methods = useForm<z.infer<typeof configValidation>>({
    resolver: zodResolver(configValidation),
    defaultValues: {
      type: Transport.STDIO,
    },
  });

  const { handleSubmit, register, control } = methods;

  const mutation = useConfigForm();

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(
          (values) => mutation.mutateAsync(values),
          console.error
        )}
        className="size-full overflow-y-auto"
      >
        <div className="flex flex-col gap-4 max-w-4xl mx-auto">
          <div className="grid grid-cols-4 w-full items-center gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              {...register("name")}
              placeholder="Enter server name"
              className="col-span-3"
            />
            <FieldErrorMessage name="name" />
          </div>
          <div className="grid grid-cols-4 w-full items-center gap-2">
            <Label htmlFor="type" required>
              Transport Type
            </Label>
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
                    <SelectItem value={Transport.HTTP}>
                      HTTP Streaming
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <OptionalFields />
        </div>
      </form>
    </FormProvider>
  );
}
