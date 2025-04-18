import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";
import type z from "zod";
import type { transportSchema } from "../../../../../server/src/validations/transport";

export function SSEFields() {
  const { register } = useFormContext<z.infer<typeof transportSchema>>();

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="url">URL</Label>
      <Input
        className="col-span-3"
        placeholder="Enter URL"
        {...register("url")}
      />
    </div>
  );
}
