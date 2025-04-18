import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";
import type z from "zod";
import type { transportSchema } from "@/validations";

export function STDIOFields() {
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
