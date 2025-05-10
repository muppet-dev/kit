import { Transport, type transportSchema } from "@muppet-kit/shared";
import { useFormContext, useWatch } from "react-hook-form";
import type z from "zod";
import { SSEFields } from "./SSE";
import { STDIOFields } from "./STDIO";

export function OptionalFields() {
  const { control } = useFormContext<z.infer<typeof transportSchema>>();
  const transportType = useWatch({ control, name: "transportType" });

  if (transportType === Transport.STDIO) return <STDIOFields />;
  return <SSEFields />;
}
