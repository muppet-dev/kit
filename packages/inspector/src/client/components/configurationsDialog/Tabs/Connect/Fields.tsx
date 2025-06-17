import { useFormContext } from "react-hook-form";
import type z from "zod";
import type { configTransportSchema as schema } from "../../../../validations";
import { ConfigFormFields } from "../../../ConfigFormFields";
import { FieldErrorMessage } from "../../../FieldErrorMessage";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";

export function FormFields() {
  const { register } = useFormContext<z.output<typeof schema>>();

  return (
    <div className="flex flex-col gap-2 overflow-y-auto h-[380px] pr-2">
      <div className="w-full grid grid-cols-4 gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="Enter Name"
          className="col-span-3"
        />
      </div>
      <FieldErrorMessage name="name" />
      <ConfigFormFields />
    </div>
  );
}
