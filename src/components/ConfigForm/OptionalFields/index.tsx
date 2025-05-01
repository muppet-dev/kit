import { useFormContext, useWatch } from "react-hook-form";
import type { transportSchema } from "@/validations";
import type z from "zod";
import { Transport } from "@/constants";
import { STDIOFields } from "./STDIO";
import { SSEFields } from "./SSE";

export function OptionalFields() {
  const { control } = useFormContext<z.infer<typeof transportSchema>>();
  const transportType = useWatch({ control, name: "transportType" });

  if (transportType === Transport.SSE) return <SSEFields />;
  return <STDIOFields />;
}
