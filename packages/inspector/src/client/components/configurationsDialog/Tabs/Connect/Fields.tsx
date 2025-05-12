import type { configTransportSchema as schema } from "@/client/validations";
import { useFormContext } from "react-hook-form";
import type z from "zod";
import { ConfigFormFields } from "../../../ConfigFormFields";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";

export function FormFields() {
  const { register } = useFormContext<z.output<typeof schema>>();

  return (
    <>
      <div className="w-full grid grid-cols-4 gap-2">
        <Label htmlFor="transportType">Name</Label>
        <Input
          {...register("name")}
          placeholder="Enter Name"
          className="col-span-3"
        />
      </div>
      <ConfigFormFields />
    </>
  );
}
