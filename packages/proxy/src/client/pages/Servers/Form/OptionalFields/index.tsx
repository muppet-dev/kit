import type { configValidation } from "@/client/validations";
import { Transport } from "@muppet-kit/shared";
import { useFormContext, useWatch } from "react-hook-form";
import type z from "zod";
import { SSEFields } from "./SSE";
import { STDIOFields } from "./STDIO";

export function OptionalFields() {
  const { control } = useFormContext<z.infer<typeof configValidation>>();
  const type = useWatch({ control, name: "type" });

  if (type === Transport.STDIO) return <STDIOFields />;
  return <SSEFields />;
}
